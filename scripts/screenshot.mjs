/**
 * Utilidad de desarrollo: captura full-page del sitio usando Chrome DevTools Protocol.
 * Uso: node scripts/screenshot.mjs <url> <out.png> <width> [mobile]
 */
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

const [url, out, widthArg = '1440', mobileArg = 'false'] = process.argv.slice(2)
const width = Number(widthArg)
const mobile = mobileArg === 'true'

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chromePath) {
  console.error('No se encontró Chrome/Edge')
  process.exit(2)
}

const port = 9300 + Math.floor(Math.random() * 400)
const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(tmpdir(), 'cdp-' + Date.now())}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getTarget() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      const list = await res.json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page
    } catch {
      /* aún no está listo */
    }
    await sleep(300)
  }
  throw new Error('DevTools no respondió')
}

const target = await getTarget()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await Promise.race([
  new Promise((r) => ws.addEventListener('open', r, { once: true })),
  sleep(10000).then(() => {
    throw new Error('timeout abriendo WebSocket')
  }),
])

let id = 0
const pending = new Map()
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    if (msg.error) reject(new Error(JSON.stringify(msg.error)))
    else resolve(msg.result)
  }
})

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
    setTimeout(() => {
      if (pending.has(msgId)) {
        pending.delete(msgId)
        reject(new Error(`timeout en ${method}`))
      }
    }, 30000)
  })

await send('Page.enable')
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile })
await send('Page.navigate', { url })
await sleep(4000)

// Scroll completo para disparar las animaciones de entrada al viewport
await send('Runtime.evaluate', {
  expression: `(async () => {
    const step = Math.round(window.innerHeight * 0.75)
    for (let y = 0; y < document.body.scrollHeight + step; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 800))
    return true
  })()`,
  awaitPromise: true,
  returnByValue: true,
})

const { result } = await send('Runtime.evaluate', {
  expression:
    '({ w: document.documentElement.clientWidth, h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) })',
  returnByValue: true,
})

const fullHeight = Math.min(result.value.h, 30000)
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height: fullHeight,
  deviceScaleFactor: 1,
  mobile,
})
await sleep(1200)

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  fromSurface: true,
})

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, Buffer.from(shot.data, 'base64'))
console.log(`OK ${out} ${width}x${fullHeight}`)
ws.close()
child.kill()
process.exit(0)

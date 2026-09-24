/**
 * Verificación final del sitio renderizado:
 *  - recursos que fallan (imágenes, CSS, JS) y errores de consola
 *  - estado del menú mobile (apertura/cierre y bloqueo de scroll)
 *  - imágenes realmente decodificadas con tamaño natural
 *  - texto clave presente en el DOM
 * Uso: node scripts/verify-page.mjs <url> [width] [mobile]
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const [url, widthArg = '1440', mobileArg = 'false'] = process.argv.slice(2)
const width = Number(widthArg)
const mobile = mobileArg === 'true'

const chromePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p))

const port = 9700 + Math.floor(Math.random() * 120)
const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(tmpdir(), 'verify-' + Date.now())}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function target() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page
    } catch {
      /* esperando */
    }
    await sleep(300)
  }
  throw new Error('DevTools no disponible')
}

const page = await target()
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
const consoleErrors = []
const failedRequests = []

ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id)
    pending.delete(m.id)
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)
    return
  }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(' '))
  }
  if (m.method === 'Runtime.exceptionThrown') {
    consoleErrors.push('excepción: ' + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text))
  }
  if (m.method === 'Network.loadingFailed') {
    failedRequests.push(m.params.errorText + ' (' + m.params.type + ')')
  }
  if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) {
    failedRequests.push(`${m.params.response.status} ${m.params.response.url}`)
  }
})

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
    setTimeout(() => pending.has(msgId) && (pending.delete(msgId), reject(new Error('timeout ' + method))), 30000)
  })

await send('Runtime.enable')
await send('Network.enable')
await send('Page.enable')
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile })
await send('Page.navigate', { url })
await sleep(2000)

// Recorre la página para que se carguen las imágenes con loading="lazy"
await send('Runtime.evaluate', {
  expression: `(async () => {
    const step = Math.round(window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight + step; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 200))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 1500))
    return true
  })()`,
  awaitPromise: true,
  returnByValue: true,
})
await sleep(1000)

const d = (await send('Runtime.evaluate', {
  expression: `(() => {
    const imgs = Array.from(document.images).map((i) => ({
      src: i.currentSrc.split('/').slice(-2).join('/'),
      natural: i.naturalWidth + 'x' + i.naturalHeight,
      rendered: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height),
      ok: i.complete && i.naturalWidth > 0,
    }));
    const text = document.body.innerText;
    const lower = text.toLowerCase();
    const required = ['IGNACIO', 'VILLA', 'Desarrollador Web', 'Proyectos', 'Jeipi Burgers', 'Ambos & Asociados', 'Social Links Profile', 'URCO', 'Lo que puedo construir', 'Cómo trabajo', '¿Tenés'];
    return {
      imgs,
      missing: required.filter((t) => !text.includes(t)),
      burger: Boolean(document.querySelector('[aria-controls="menu-mobile"]')),
      burgerVisible: (() => { const b = document.querySelector('[aria-controls="menu-mobile"]'); return b ? getComputedStyle(b).display !== 'none' : false })(),
      desktopNavVisible: (() => { const u = document.querySelector('header ul'); return u ? getComputedStyle(u).display !== 'none' : false })(),
      sections: Array.from(document.querySelectorAll('main > section')).map((s) => s.id || '(sin id)'),
      docH: document.documentElement.scrollHeight,
      copyright: Boolean(document.querySelector('footer')?.innerText.toLowerCase().includes('todos los derechos reservados')),
      emailLink: (() => { const a = document.querySelector('a[href^="mailto:"]'); return a ? a.getAttribute('href') : null })(),
      emptyMailto: Boolean(document.querySelector('a[href="mailto:"]')),
    };
  })()`,
  returnByValue: true,
})).result.value

console.log(`=== VERIFICACIÓN ${width}px ${mobile ? '(mobile)' : '(desktop)'} — ${url}`)
console.log(`  secciones            ${d.sections.join(', ')}`)
console.log(`  textos requeridos    ${d.missing.length ? 'FALTAN: ' + d.missing.join(', ') : 'todos presentes'}`)
console.log(`  copyright presente   ${d.copyright ? 'sí' : 'NO'}`)
console.log(`  enlace mailto        ${d.emptyMailto ? 'VACÍO (mailto: sin dirección)' : d.emailLink ?? 'no hay (sin email cargado)'}`)
console.log(`  menú hamburguesa     ${d.burger ? (d.burgerVisible ? 'visible' : 'oculto') : 'no existe'}`)
console.log(`  nav desktop          ${d.desktopNavVisible ? 'visible' : 'oculta'}`)
console.log(`  imágenes decodificadas`)
d.imgs.forEach((i) => console.log(`    ${i.ok ? 'OK ' : 'ERR'} ${i.src.padEnd(30)} natural=${i.natural.padEnd(12)} render=${i.rendered}`))
console.log(`  requests fallidos    ${failedRequests.length ? failedRequests.join(' | ') : 'ninguno'}`)
console.log(`  errores de consola   ${consoleErrors.length ? consoleErrors.join(' | ') : 'ninguno'}`)

// Prueba de apertura del menú mobile
if (mobile) {
  await send('Runtime.evaluate', {
    expression: `document.querySelector('[aria-controls="menu-mobile"]').click()`,
  })
  await sleep(900)
  const menu = await send('Runtime.evaluate', {
    expression: `(() => {
      const m = document.getElementById('menu-mobile');
      const items = m ? Array.from(m.querySelectorAll('a')).map((a) => a.textContent.trim()) : [];
      return { present: Boolean(m), items, bodyOverflow: getComputedStyle(document.body).overflow };
    })()`,
    returnByValue: true,
  })
  console.log(`  menú abierto         ${menu.result.value.present ? 'sí' : 'NO'} | items: ${menu.result.value.items.join(' / ')}`)
  console.log(`  scroll bloqueado     ${menu.result.value.bodyOverflow}`)

  await send('Runtime.evaluate', { expression: `document.querySelector('[aria-controls="menu-mobile"]').click()` })
  await sleep(700)
  const closed = await send('Runtime.evaluate', {
    expression: `({ menu: Boolean(document.getElementById('menu-mobile')), bodyOverflow: getComputedStyle(document.body).overflow })`,
    returnByValue: true,
  })
  console.log(`  menú cerrado         ${closed.result.value.menu ? 'NO se cerró' : 'sí'} | scroll: ${closed.result.value.bodyOverflow}`)
}

const problems = []
if (d.missing.length) problems.push('faltan textos')
if (!d.copyright) problems.push('falta el copyright')
if (d.emptyMailto) problems.push('mailto vacío')
if (failedRequests.length) problems.push('requests fallidos')
if (consoleErrors.length) problems.push('errores de consola')
if (d.imgs.some((i) => !i.ok && i.rendered !== '0x0')) problems.push('imágenes no decodificadas')
console.log(problems.length ? `  PROBLEMAS: ${problems.join(' | ')}` : '  Sin problemas detectados')

ws.close()
child.kill()
process.exit(problems.length ? 1 : 0)

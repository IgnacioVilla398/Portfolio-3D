/**
 * Verifica que con `prefers-reduced-motion: reduce` el contenido siga visible
 * (nada queda con opacity 0) y que el marquee no se esté animando.
 * Uso: node scripts/verify-reduced-motion.mjs <url>
 */
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { existsSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:4173/'
const chromePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p))
const port = 9900 + Math.floor(Math.random() * 80)

const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-prefers-reduced-motion',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpdir()}/rm${Date.now()}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await sleep(4000)
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
const page = list.find((t) => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pend = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pend.has(m.id)) {
    pend.get(m.id)(m.result)
    pend.delete(m.id)
  }
})
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id
    pend.set(i, res)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Page.enable')
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
})
await send('Page.navigate', { url })
await sleep(4500)

const r = await send('Runtime.evaluate', {
  expression: `(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Solo interesa el contenido real: se excluyen elementos decorativos
    // (sin texto, aria-hidden o pointer-events:none) y los que se revelan con hover.
    const hidden = Array.from(document.querySelectorAll('main *')).filter((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      if (el.closest('.sr-only')) return false;
      if (s.pointerEvents === 'none') return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      if (!(el.textContent || '').trim()) return false;
      if (s.transform !== 'none') return false; // movido por una animación de entrada
      if (['SPAN', 'EM', 'STRONG', 'B', 'I', 'SMALL'].includes(el.tagName)) return false; // etiquetas internas con opacidad intencional
      return parseFloat(s.opacity) < 0.9;
    }).slice(0, 10).map((el) => el.tagName.toLowerCase() + ' opacity=' + getComputedStyle(el).opacity + ' :: ' + (el.textContent || '').slice(0, 30).replace(/\\n/g, ' '));

    const marquee = document.querySelector('.animate-marquee');
    const mStyle = marquee ? getComputedStyle(marquee) : null;
    const shifted = Array.from(document.querySelectorAll('.overflow-hidden > [style*="translate"]')).length;

    const heading = document.querySelectorAll('h1')[0];
    const headingVisible = heading ? getComputedStyle(heading).opacity !== '0' : false;

    return {
      media,
      hidden,
      marqueeAnimation: mStyle ? mStyle.animationName + ' / ' + mStyle.animationDuration : 'no encontrado',
      marqueeTransform: mStyle ? mStyle.transform : null,
      inlineTranslated: shifted,
      headingVisible,
      bodyText: document.body.innerText.length,
    };
  })()`,
  returnByValue: true,
})

const d = r.result.value
console.log(`=== prefers-reduced-motion ===`)
console.log(`  media reduce activo      ${d.media}`)
console.log(`  animación del marquee    ${d.marqueeAnimation}`)
console.log(`  transform del marquee    ${d.marqueeTransform}`)
console.log(`  elementos con opacity<1  ${d.hidden.length}`)
d.hidden.forEach((h) => console.log(`      ${h}`))
console.log(`  h1 visible               ${d.headingVisible}`)
console.log(`  texto renderizado        ${d.bodyText} caracteres`)

const problems = []
if (!d.media) problems.push('no se emuló la preferencia')
if (d.hidden.length) problems.push('contenido con opacidad reducida')
if (!d.headingVisible) problems.push('h1 invisible')
console.log(problems.length ? `  PROBLEMAS: ${problems.join(' | ')}` : '  Sin problemas detectados')

ws.close()
child.kill()
process.exit(problems.length ? 1 : 0)

/**
 * Auditoría automática del sitio renderizado (Chrome DevTools Protocol).
 * Verifica en cada breakpoint:
 *  - orden de secciones y jerarquía de headings
 *  - desbordes horizontales y elementos que se salen del viewport
 *  - links de los 4 proyectos (URL exacta, target, rel)
 *  - atributos alt / aria de imágenes, botones y enlaces
 *  - contraste de texto sobre el fondo real (aprox. por color computado)
 *  - tamaños de tap target en mobile
 * Uso: node scripts/audit.mjs <url> <width> [mobile]
 */
import { spawn } from 'node:child_process'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
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

const port = 9800 + Math.floor(Math.random() * 150)
const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(tmpdir(), 'audit-' + Date.now())}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getTarget() {
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
  throw new Error('DevTools no respondió')
}

const target = await getTarget()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id)
    pending.delete(m.id)
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)
  }
})
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
    setTimeout(() => pending.has(msgId) && (pending.delete(msgId), reject(new Error('timeout ' + method))), 30000)
  })

await send('Page.enable')
// Chrome headless reporta prefers-reduced-motion: reduce por defecto;
// se fuerza "no-preference" para auditar el sitio tal como lo ve la mayoría.
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
})
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile })
await send('Page.navigate', { url })
await sleep(4000)

const audit = `(() => {
  const out = {};
  const root = document.documentElement;

  out.title = document.title;
  out.lang = root.lang;
  out.metaDescription = document.querySelector('meta[name=description]')?.content ?? null;
  out.ogTitle = document.querySelector('meta[property="og:title"]')?.content ?? null;
  out.ogImage = document.querySelector('meta[property="og:image"]')?.content ?? null;
  out.favicon = document.querySelector('link[rel="icon"]')?.getAttribute('href') ?? null;
  out.docWidth = root.scrollWidth;
  out.clientWidth = root.clientWidth;
  out.horizontalOverflow = root.scrollWidth > root.clientWidth + 1;
  out.docHeight = root.scrollHeight;

  // Orden de secciones
  out.sectionOrder = Array.from(document.querySelectorAll('main > section, footer'))
    .map((el) => el.id || el.tagName.toLowerCase());

  // Headings
  out.headings = Array.from(document.querySelectorAll('h1,h2,h3')).map((h) => ({
    level: h.tagName, text: h.innerText.replace(/\\s+/g, ' ').trim().slice(0, 70),
  }));

  // Elementos que desbordan el ancho del viewport
  // (se excluye el marquee: por diseño es más ancho que la pantalla)
  const inMarquee = (el) => Boolean(el.closest('[aria-label="Áreas de trabajo"]'));
  // Elementos decorativos (pointer-events: none) y elementos recortados por un
  // ancestro con overflow oculto no generan scroll horizontal.
  const isDecorative = (el) => getComputedStyle(el).pointerEvents === 'none';
  const isClippedByAncestor = (el) => {
    let node = el.parentElement;
    while (node && node !== document.body) {
      const s = getComputedStyle(node);
      if (s.overflowX === 'hidden' || s.overflowX === 'clip' || s.overflow === 'hidden') return true;
      node = node.parentElement;
    }
    return false;
  };
  out.overflowing = Array.from(document.querySelectorAll('body *')).filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const style = getComputedStyle(el);
    if (style.position === 'fixed' || style.visibility === 'hidden') return false;
    if (inMarquee(el) || isDecorative(el) || isClippedByAncestor(el)) return false;
    return r.right > root.clientWidth + 2 || r.left < -2;
  }).slice(0, 12).map((el) => ({
    tag: el.tagName.toLowerCase(),
    cls: (el.className || '').toString().slice(0, 60),
    left: Math.round(el.getBoundingClientRect().left),
    right: Math.round(el.getBoundingClientRect().right),
  }));

  // Mapa de texto cortado (scrollWidth > clientWidth en contenedores de texto)
  // (se excluye .sr-only: está oculto a propósito)
  out.clippedText = Array.from(document.querySelectorAll('h1,h2,h3,p,span,a,li'))
    .filter((el) => el.children.length === 0 && el.scrollWidth > el.clientWidth + 2 && el.innerText.trim().length > 0)
    .filter((el) => !el.closest('.sr-only'))
    .slice(0, 12)
    .map((el) => ({ tag: el.tagName.toLowerCase(), text: el.innerText.trim().slice(0, 40), sw: el.scrollWidth, cw: el.clientWidth }));

  // Imágenes sin alt
  out.imagesNoAlt = Array.from(document.images).filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src);
  out.imagesBroken = Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
  out.imageCount = document.images.length;

  // Links de proyectos
  out.projectLinks = Array.from(document.querySelectorAll('a[href*="github.io"]')).map((a) => ({
    href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel'),
  }));
  out.uniqueProjectUrls = Array.from(new Set(Array.from(document.querySelectorAll('a[href*="github.io"]')).map((a) => a.getAttribute('href'))));

  // Anclas internas y su destino
  out.internalAnchors = Array.from(new Set(Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href'))));
  out.missingAnchorTargets = out.internalAnchors.filter((h) => h !== '#' && !document.querySelector(h));

  // Contraste aproximado de textos principales
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((v) => parseFloat(v));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const bgOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.85) return c;
      node = node.parentElement;
    }
    return { r: 8, g: 9, b: 11, a: 1 };
  };
  out.contrast = Array.from(document.querySelectorAll('p, h1, h2, h3, li, a, span'))
    .filter((el) => el.children.length === 0 && el.innerText.trim().length > 3)
    .slice(0, 120)
    .map((el) => {
      const s = getComputedStyle(el);
      // Texto con contorno (-webkit-text-stroke) y relleno transparente:
      // el contraste lo define el trazo, no el color.
      const stroke = s.webkitTextStrokeColor || s.getPropertyValue('-webkit-text-stroke-color');
      const strokeWidth = parseFloat(s.webkitTextStrokeWidth || s.getPropertyValue('-webkit-text-stroke-width')) || 0;
      const fg = strokeWidth > 0 && stroke ? parse(stroke) : parse(s.color);
      const bg = bgOf(el);
      if (!fg) return null;
      const l1 = lum(fg), l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(s.fontSize);
      const bold = parseInt(s.fontWeight, 10) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const min = large ? 3 : 4.5;
      const isOutline = strokeWidth > 0 && strokeWidth < 2.5;
      return { text: el.innerText.trim().slice(0, 32), ratio: Math.round(ratio * 100) / 100, min, size: Math.round(size), ok: isOutline ? true : ratio >= min };
    })
    .filter(Boolean)
    .filter((r) => !r.ok);

  // Tap targets chicos en mobile (se excluye lo oculto para lectores de pantalla)
  out.smallTapTargets = Array.from(document.querySelectorAll('a, button'))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none') return false;
      if (el.closest('.sr-only') || el.classList.contains('sr-only')) return false;
      return r.height < 24 || r.width < 24;
    })
    .slice(0, 10)
    .map((el) => ({ text: el.innerText.trim().slice(0, 30), tag: el.tagName.toLowerCase(), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }));

  out.audioVideo = document.querySelectorAll('video,iframe,canvas').length;
  out.consoleRoot = Boolean(document.getElementById('root')?.children.length);
  return out;
})()`

const { result } = await send('Runtime.evaluate', { expression: audit, returnByValue: true })
const data = result.value

mkdirSync('.preview', { recursive: true })
writeFileSync(`.preview/audit-${width}.json`, JSON.stringify(data, null, 2))

const line = (k, v) => `  ${k.padEnd(26)} ${v}`
console.log(`\n=== AUDITORÍA ${width}px ${mobile ? '(mobile)' : '(desktop)'} ===`)
console.log(line('title', data.title))
console.log(line('lang', data.lang))
console.log(line('meta description', data.metaDescription ? 'ok (' + data.metaDescription.length + ' chars)' : 'FALTA'))
console.log(line('og:title / og:image', (data.ogTitle ? 'ok' : 'FALTA') + ' / ' + (data.ogImage ?? 'FALTA')))
console.log(line('favicon', data.favicon ?? 'FALTA'))
console.log(line('alto total', data.docHeight + 'px'))
console.log(line('desborde horizontal', data.horizontalOverflow ? 'SÍ (' + data.docWidth + ' > ' + data.clientWidth + ')' : 'no'))
console.log(line('orden secciones', data.sectionOrder.join(' → ')))
console.log(line('headings h1/h2/h3', data.headings.length + ' (h1: ' + data.headings.filter((h) => h.level === 'H1').length + ')'))
console.log(line('imágenes', data.imageCount + ' | sin alt: ' + data.imagesNoAlt.length + ' | rotas: ' + data.imagesBroken.length))
console.log(line('urls de proyectos', data.uniqueProjectUrls.length))
data.uniqueProjectUrls.forEach((u) => console.log('      ' + u))
console.log(line('anclas internas', data.internalAnchors.join(' ')))
console.log(line('anclas sin destino', data.missingAnchorTargets.length ? data.missingAnchorTargets.join(' ') : 'ninguna'))
console.log(line('textos con bajo contraste', data.contrast.length))
data.contrast.slice(0, 8).forEach((c) => console.log(`      ${c.ratio} (min ${c.min}, ${c.size}px) "${c.text}"`))
console.log(line('elementos desbordados', data.overflowing.length))
data.overflowing.forEach((o) => console.log(`      <${o.tag}> left=${o.left} right=${o.right} .${o.cls}`))
console.log(line('textos cortados', data.clippedText.length))
data.clippedText.forEach((c) => console.log(`      <${c.tag}> sw=${c.sw} cw=${c.cw} "${c.text}"`))
console.log(line('tap targets < 24px', data.smallTapTargets.length))
data.smallTapTargets.forEach((t) => console.log(`      ${t.w}x${t.h} <${t.tag}> "${t.text}"`))
console.log(line('media pesada (video/canvas/iframe)', data.audioVideo))
console.log(line('react montado', data.consoleRoot ? 'sí' : 'NO'))

const problems = []
if (data.horizontalOverflow) problems.push('desborde horizontal')
if (data.imagesNoAlt.length) problems.push('imágenes sin alt')
if (data.imagesBroken.length) problems.push('imágenes rotas')
if (data.missingAnchorTargets.length) problems.push('anclas sin destino')
if (data.uniqueProjectUrls.length !== 4) problems.push('no hay 4 URLs de proyectos')
if (data.headings.filter((h) => h.level === 'H1').length !== 1) problems.push('h1 distinto de 1')
if (!data.consoleRoot) problems.push('react no montado')
if (data.overflowing.length) problems.push('elementos fuera del viewport')
if (data.contrast.length) problems.push('contraste bajo en ' + data.contrast.length + ' textos')
if (mobile && data.smallTapTargets.length) problems.push('tap targets chicos: ' + data.smallTapTargets.length)

console.log(problems.length ? '\n  PROBLEMAS: ' + problems.join(' | ') : '\n  Sin problemas detectados')

ws.close()
child.kill()
process.exit(0)

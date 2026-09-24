/**
 * Verificación del hero y de la visibilidad de los proyectos.
 *  - orden del hero: nombre → pieza 3D → presentación → CTAs
 *  - la pieza 3D está centrada y tiene animación flotante activa
 *  - la sección siguiente al hero es Proyectos
 *  - las capturas de proyectos se muestran a opacidad plena y con hover evidente
 * Uso: node scripts/verify-hero.mjs <url> [width]
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const [url, widthArg = '1440'] = process.argv.slice(2)
const width = Number(widthArg)

const chromePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p))
const port = 9500 + Math.floor(Math.random() * 90)

const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(tmpdir(), 'hero-' + Date.now())}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await sleep(4000)
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl)
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
// Chrome headless reporta prefers-reduced-motion: reduce por defecto;
// se fuerza "no-preference" para auditar el sitio tal como lo ve la mayoría.
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
})
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 })
await send('Page.navigate', { url })
await sleep(5000)

const hero = await send('Runtime.evaluate', {
  expression: `(() => {
    const hero = document.getElementById('inicio');
    const kids = Array.from(hero.querySelectorAll('.shell > *')).map((el) => ({
      tag: el.tagName.toLowerCase(),
      y: Math.round(el.getBoundingClientRect().top + window.scrollY),
      text: el.innerText.replace(/\\s+/g, ' ').trim().slice(0, 46),
    }));
    const h1 = hero.querySelector('h1');
    const img = hero.querySelector('img');
    const fig = img ? img.closest('figure') : null;
    const figBox = fig ? fig.getBoundingClientRect() : null;
    const heroBox = hero.getBoundingClientRect();
    return {
      order: kids,
      h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + window.scrollY) : null,
      imgTop: img ? Math.round(img.getBoundingClientRect().top + window.scrollY) : null,
      imgNatural: img ? img.naturalWidth + 'x' + img.naturalHeight : null,
      imgOpacity: img ? getComputedStyle(img).opacity : null,
      imgMask: img ? (getComputedStyle(img).maskImage || getComputedStyle(img).webkitMaskImage || 'none') : null,
      hasFrame: fig ? Boolean(fig.querySelector('.border.rounded-\\\\[1\\\\.75rem\\\\]')) : null,
      centerDelta: figBox && heroBox ? Math.round((figBox.left + figBox.width / 2) - (heroBox.left + heroBox.width / 2)) : null,
      floatAnimation: (() => {
        const walking = Array.from(hero.querySelectorAll('div')).filter((d) => getComputedStyle(d).animationName === 'float');
        if (!walking.length) return 'NO hay animación float';
        const s = getComputedStyle(walking[0]);
        return 'float ' + s.animationDuration + ' ' + s.animationIterationCount + ' ' + s.animationTimingFunction;
      })(),
      floatTransform: (() => {
        const walking = Array.from(hero.querySelectorAll('div')).filter((d) => getComputedStyle(d).animationName === 'float');
        return walking.length ? getComputedStyle(walking[0]).transform : null;
      })(),
      nextSection: (() => {
        const secs = Array.from(document.querySelectorAll('main > section'));
        const i = secs.indexOf(hero);
        const n = secs[i + 1];
        return n ? (n.id || '(sin id)') : '(ninguna)';
      })(),
      heroHeight: Math.round(heroBox.height),
      headBox: figBox
        ? {
            x: Math.round(figBox.left),
            y: Math.round(figBox.top + window.scrollY),
            w: Math.round(figBox.width),
            h: Math.round(figBox.height),
          }
        : null,
    };
  })()`,
  returnByValue: true,
})

/** Cuenta píxeles con contenido dentro de la caja de la pieza 3D. */

const p = await send('Runtime.evaluate', {
  expression: `(async () => {
    // Desplaza para que carguen las capturas diferidas
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight + step; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 900));

    const imgs = Array.from(document.querySelectorAll('main img')).filter((i) => i.currentSrc.includes('/proyectos/'));
    const cards = Array.from(document.querySelectorAll('article[id^="proyecto-"], article'));
    return {
      imgs: imgs.map((i) => {
        const a = i.closest('a');
        const s = getComputedStyle(i);
        const card = a ? getComputedStyle(a) : null;
        const ind = a ? a.querySelector('span.absolute.bottom-4') : null;
        return {
          src: i.currentSrc.split('/').pop(),
          opacity: s.opacity,
          brightness: s.filter || 'none',
          overlayOscuro: Boolean(a?.querySelector('div.absolute.inset-0')),
          indicador: ind ? getComputedStyle(ind).opacity : 'no encontrado',
          borde: card?.borderTopColor,
          transition: card?.transitionProperty,
          hoverLift: (a?.className || '').includes('hover:-translate-y-1'),
        };
      }),
      articleCount: cards.length,
      animatedOnScroll: cards.filter((c) => getComputedStyle(c).opacity === '0').length,
    };
  })()`,
  awaitPromise: true,
  returnByValue: true,
})

const d = hero.result.value

// Recorte del viewport (el hero es lo primero que se ve) para medir la pieza.
const viewportShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
const { writeFileSync } = await import('node:fs')
writeFileSync('.preview/hero-viewport.png', Buffer.from(viewportShot.data, 'base64'))

console.log(`=== HERO ${width}px — ${url}`)
console.log('  bloques del hero (en orden):')
d.order.forEach((k) => console.log(`    <${k.tag}> y=${k.y}  "${k.text}"`))
console.log(`  nombre (h1) y=${d.h1Top} | cabeza y=${d.imgTop} → ${d.imgTop > d.h1Top ? 'debajo del nombre ✔' : 'ARRIBA del nombre ✘'}`)
console.log(`  imagen: natural=${d.imgNatural} opacity=${d.imgOpacity}`)
console.log(`  máscara: ${d.imgMask}`)
console.log(`  centrado horizontal (desvío): ${d.centerDelta}px`)
console.log(`  animación flotante: ${d.floatAnimation}`)
console.log(`  transform en curso: ${d.floatTransform}`)
console.log(`  sección siguiente al hero: ${d.nextSection}`)
console.log(`  alto del hero: ${d.heroHeight}px`)
console.log(`  caja de la pieza: ${d.headBox ? `${d.headBox.w}x${d.headBox.h} en x=${d.headBox.x}, y=${d.headBox.y}` : 'no encontrada'}`)

const pr = p.result.value
console.log(`\n  capturas de proyectos (${pr.imgs.length} imágenes, ${pr.articleCount} artículos):`)
pr.imgs.forEach((i) =>
  console.log(
    `    ${i.src.padEnd(12)} opacity=${i.opacity} filtro=${i.brightness} overlay-oscuro=${i.overlayOscuro} indicador=${i.indicador} borde=${i.borde} lift-hover=${i.hoverLift}`,
  ),
)
console.log(`  artículos aún invisibles: ${pr.animatedOnScroll} (0 = todos visibles)`)

const problems = []
if (d.h1Top === null || d.imgTop < d.h1Top) problems.push('la cabeza no está debajo del nombre')
if (Math.abs(d.centerDelta ?? 99) > 4) problems.push('la cabeza no está centrada')
if (!String(d.floatAnimation).startsWith('float')) problems.push('falta la animación flotante')
if (d.nextSection !== 'proyectos') problems.push('la sección siguiente no es Proyectos')
if (pr.imgs.some((i) => parseFloat(i.opacity) < 1)) problems.push('hay capturas con opacidad reducida')
if (pr.imgs.some((i) => i.overlayOscuro)) problems.push('hay capturas con overlay oscuro encima')
if (pr.imgs.some((i) => parseFloat(i.indicador) < 1)) problems.push('el indicador de apertura no está visible por defecto')
if (pr.imgs.some((i) => !i.hoverLift)) problems.push('falta el realce en hover de alguna tarjeta')
if (pr.animatedOnScroll > 0) problems.push('hay artículos de proyecto invisibles tras hacer scroll')
console.log(problems.length ? `\n  PROBLEMAS: ${problems.join(' | ')}` : '\n  Sin problemas detectados')

ws.close()
child.kill()
process.exit(problems.length ? 1 : 0)

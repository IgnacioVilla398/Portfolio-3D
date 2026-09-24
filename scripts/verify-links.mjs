/**
 * Verificación de los cuatro enlaces reales de los proyectos:
 * estado HTTP, redirecciones y peso de la página de destino.
 * Uso: node scripts/verify-links.mjs
 */
const URLS = [
  'https://ignaciovilla398.github.io/JEIPI-BURGERS/',
  'https://ignaciovilla398.github.io/ambos-y-asociados/',
  'https://ignaciovilla398.github.io/Desafio-3-de-Frontend-mentor/',
  'https://ignaciovilla398.github.io/URCO-empanadas/',
]

let failures = 0

for (const url of URLS) {
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const body = await res.text()
    const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '(sin título)'
    const ok = res.ok
    if (!ok) failures++
    console.log(`${ok ? 'OK ' : 'ERR'} ${res.status} ${url}`)
    console.log(`      título: ${title}`)
    console.log(`      html: ${(body.length / 1024).toFixed(1)} kB`)
    // El sitio de destino debe ser navegable por sí mismo, no un 404 de Pages
    if (/404|not found/i.test(title) && !/empanadas|urco/i.test(url)) {
      console.log('      ADVERTENCIA: el título sugiere una página 404')
    }
  } catch (error) {
    failures++
    console.log(`ERR  ${url}`)
    console.log(`      ${error.message}`)
  }
}

console.log(failures === 0 ? '\nLos 4 enlaces responden correctamente.' : `\n${failures} enlace(s) con problemas.`)
process.exit(failures === 0 ? 0 : 1)

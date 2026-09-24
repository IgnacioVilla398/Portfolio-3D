/**
 * Muestreo de color por regiones de un PNG: verifica que las imágenes reales
 * se estén dibujando (no placeholders planos) y revisa el fondo del hero.
 * Uso: node scripts/sample-image.mjs <archivo.png> [cols] [rows]
 */
import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'

const [file, colsArg = '96', rowsArg = '40'] = process.argv.slice(2)
const cols = Number(colsArg)
const rows = Number(rowsArg)

const png = readFileSync(file)
if (png.readUInt32BE(0) !== 0x89504e47) throw new Error('No es un PNG')

// ---- Decodifica la imagen (soporta RGBA/RGB de 8 bits, sin entrelazado) ----
let pos = 8
let width = 0
let height = 0
let bitDepth = 0
let colorType = 0
const idat = []

while (pos < png.length) {
  const len = png.readUInt32BE(pos)
  const type = png.toString('ascii', pos + 4, pos + 8)
  const data = png.subarray(pos + 8, pos + 8 + len)
  if (type === 'IHDR') {
    width = data.readUInt32BE(0)
    height = data.readUInt32BE(4)
    bitDepth = data[8]
    colorType = data[9]
    if (bitDepth !== 8) throw new Error('Solo se soporta 8 bits por canal')
  } else if (type === 'IDAT') {
    idat.push(data)
  } else if (type === 'IEND') {
    break
  }
  pos += 12 + len
}

const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType]
if (!channels) throw new Error('Tipo de color no soportado: ' + colorType)

const raw = inflateSync(Buffer.concat(idat))
const stride = width * channels
const pixels = Buffer.alloc(height * stride)

for (let y = 0; y < height; y++) {
  const filter = raw[y * (stride + 1)]
  const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
  const out = pixels.subarray(y * stride, (y + 1) * stride)
  const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null
  for (let x = 0; x < stride; x++) {
    const a = x >= channels ? out[x - channels] : 0
    const b = prev ? prev[x] : 0
    const c = prev && x >= channels ? prev[x - channels] : 0
    let v = line[x]
    if (filter === 1) v += a
    else if (filter === 2) v += b
    else if (filter === 3) v += (a + b) >> 1
    else if (filter === 4) {
      const p = a + b - c
      const pa = Math.abs(p - a)
      const pb = Math.abs(p - b)
      const pc = Math.abs(p - c)
      v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
    }
    out[x] = v & 0xff
  }
}

const px = (x, y) => {
  const i = y * stride + x * channels
  return { r: pixels[i], g: pixels[i + channels - 3] ?? pixels[i], b: pixels[i + channels - 3 + 1] ?? pixels[i], a: channels === 4 ? pixels[i + 3] : 255 }
}
const rgb = (x, y) => {
  const i = y * stride + x * channels
  if (channels >= 3) return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] }
  return { r: pixels[i], g: pixels[i], b: pixels[i] }
}

console.log(`archivo: ${file}  ${width}x${height}  canales=${channels}`)

const RAMP = ' .:-=+*#%@'
const tileH = Math.ceil(height / rows)
const tileW = Math.ceil(width / cols)

for (let ty = 0; ty < rows; ty++) {
  let line = ''
  for (let tx = 0; tx < cols; tx++) {
    let sum = 0
    let n = 0
    let rs = 0
    let gs = 0
    let bs = 0
    for (let y = ty * tileH; y < Math.min((ty + 1) * tileH, height); y += 2) {
      for (let x = tx * tileW; x < Math.min((tx + 1) * tileW, width); x += 2) {
        const c = rgb(x, y)
        sum += 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
        rs += c.r
        gs += c.g
        bs += c.b
        n++
      }
    }
    const lum = sum / n
    line += RAMP[Math.min(RAMP.length - 1, Math.round((lum / 255) * (RAMP.length - 1)))]
  }
  console.log(line)
}

// Variación global de luminancia: detecta zonas planas (placeholder / vacío)
let min = 255
let max = 0
let sum = 0
let n = 0
for (let y = 0; y < height; y += 4) {
  for (let x = 0; x < width; x += 4) {
    const c = rgb(x, y)
    const l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
    if (l < min) min = l
    if (l > max) max = l
    sum += l
    n++
  }
}
console.log(`luminancia: min=${min.toFixed(0)} max=${max.toFixed(0)} media=${(sum / n).toFixed(1)} rango=${(max - min).toFixed(0)}`)

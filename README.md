# Ignacio Villa — Portfolio

Portfolio personal de **Ignacio Villa**, desarrollador web. Landing completa con
estética editorial oscura, construida alrededor de cuatro proyectos reales publicados.

> **Ignacio Villa** — Desarrollador Web · Full Stack · Tecnología & IA
> Desarrollo experiencias web modernas, funcionales y pensadas para resolver problemas reales.

---

## Stack del proyecto

| Área        | Tecnología                          |
| ----------- | ----------------------------------- |
| Base        | Vite + React 18                     |
| Lenguaje    | TypeScript (strict)                 |
| Estilos     | Tailwind CSS 3                      |
| Animaciones | Framer Motion                       |
| Iconos      | Lucide React                        |
| Tipografía  | Inter / Inter Tight / JetBrains Mono (Google Fonts) |

## Cómo ejecutarlo

```bash
npm install      # instalar dependencias
npm run dev      # entorno local → http://localhost:5173
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
```

## Estructura

```
src/
  App.tsx                     Composición de las secciones
  data/site.ts                ← TODO el contenido y los datos editables
  lib/motion.ts               Curvas y variantes de animación compartidas
  styles/globals.css          Tokens base, utilidades y prefers-reduced-motion
  components/
    layout/     Navbar, Footer
    primitives/ Section, Reveal, Stagger, LineReveal, SectionHeading
    sections/   Hero, HeroPortrait, Marquee, About, Projects,
                Services, Stack, Process, Philosophy, Contact
public/
  brand/ignacio-villa-head.jpg   Retrato del hero (pieza 3D)
  proyectos/*.jpg                Capturas reales de los cuatro sitios
  favicon.svg, manifest.webmanifest
scripts/
  screenshot.mjs   Captura full-page con Chrome DevTools Protocol
  audit.mjs        Auditoría de layout, contraste, links y accesibilidad
  sample-image.mjs Muestreo de luminancia de un PNG (verificación visual)
imagenes/          Carpeta original provista (incluye la pieza en alta resolución)
```

## Contenido editable

Todo el texto y los datos viven en `src/data/site.ts`:

- `SITE` — nombre, rol, tagline y presentación del hero.
- `CONTACT` — **email, LinkedIn e Instagram están vacíos a propósito** (no se inventó
  ninguna información de contacto). Al completar un valor, el enlace se activa solo:
  hasta entonces el sitio muestra un placeholder “próximamente”.
- `PROJECTS` — los cuatro proyectos reales, con URL, descripción, captura y stack.
- `SECTION_INDEX` — numeración editorial de las secciones ((01), (02), …), usada por
  los encabezados y la navegación.
- `SERVICES`, `STACK`, `PROCESS`, `MARQUEE_ITEMS`.

En la sección **Stack**, cada tecnología declara su estado real: `En uso`,
`Aprendiendo` o `Explorando` (nada se presenta como experiencia consolidada sin serlo).

## Secciones

Navbar → **Hero** (nombre + pieza 3D flotante) → **Proyectos** → Marquee →
Sobre mí → Servicios/Capacidades → Stack → Proceso → Filosofía → Contacto → Footer.

### Hero

1. El nombre **IGNACIO VILLA** arriba, en tipografía display (la segunda línea en contorno).
2. Justo debajo, la **pieza 3D** de `public/brand/` flotando en el centro, sin marco:
   máscara circular que funde los bordes con el fondo, halo frío, anillo fino y un
   loop idle suave (`animate-float`, 7 s) que se desactiva con `prefers-reduced-motion`.
3. Presentación y los dos accesos: **Ver proyectos** (scroll a la sección) y **Contactarme**.

La sección siguiente al hero es **Proyectos**, con la numeración editorial
centralizada en `SECTION_INDEX` (`src/data/site.ts`).

## Proyectos reales incluidos

| #   | Proyecto             | Categoría                              | URL                                                          |
| --- | -------------------- | -------------------------------------- | ------------------------------------------------------------ |
| 01  | Jeipi Burgers        | Web Development · Gastronomía          | https://ignaciovilla398.github.io/JEIPI-BURGERS/             |
| 02  | Ambos & Asociados    | Web Development · Estudio Jurídico     | https://ignaciovilla398.github.io/ambos-y-asociados/         |
| 03  | Social Links Profile | Frontend Development · Frontend Mentor | https://ignaciovilla398.github.io/Desafio-3-de-Frontend-mentor/ |
| 04  | URCO — Empanadas     | Web Development · Gastronomía          | https://ignaciovilla398.github.io/URCO-empanadas/            |

## Accesibilidad y rendimiento

- HTML semántico, un solo `h1`, jerarquía de headings correcta.
- Foco visible, enlace “Saltar al contenido”, `aria-label` en navegaciones y botones.
- `prefers-reduced-motion` respetado de forma global (CSS + Framer Motion):
  las animaciones de entrada, el reveal por líneas y el marquee se desactivan.
- Imágenes con `width`/`height`, `loading="lazy"` y `decoding="async"`.
- Contraste verificado sobre el fondo real en desktop y mobile.
- Sin video, canvas, WebGL ni librerías de animación pesadas.

## Utilidades de verificación

```bash
node scripts/audit.mjs http://localhost:4173/ 1440 false   # auditoría desktop
node scripts/audit.mjs http://localhost:4173/ 390 true     # auditoría mobile
node scripts/verify-hero.mjs http://localhost:4173/ 1440   # orden del hero, flotación y visibilidad de proyectos
node scripts/screenshot.mjs http://localhost:4173/ .preview/desktop.png 1440
```

> Nota: Chrome headless reporta `prefers-reduced-motion: reduce` por defecto; los
> scripts fuerzan `no-preference` (salvo `verify-reduced-motion.mjs`) para auditar el
> sitio tal como lo ve la mayoría de los usuarios.

Generan salida en `.preview/` (ignorada por git).

## Despliegue

**Vercel / Netlify** — framework detectado automáticamente (Vite):

- Build command: `npm run build`
- Output directory: `dist`

**GitHub Pages** — `vite.config.ts` ya usa `base: './'` (rutas relativas), así que el
build funciona igual en la raíz del dominio o en una subcarpeta de repositorio:

```bash
npm run build
# publicar el contenido de dist/ en la rama gh-pages
```

---

© 2026 Ignacio Villa. Todos los derechos reservados.

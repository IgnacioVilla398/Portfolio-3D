export const SITE = {
  name: 'Ignacio Villa',
  role: 'Desarrollador Web · Full Stack · Tecnología & IA',
  tagline: 'Desarrollo web moderno con visión de producto.',
  intro:
    'Diseño y desarrollo experiencias digitales modernas, combinando código, diseño y tecnología para transformar ideas en productos web funcionales.',
} as const

/**
 * Datos de contacto.
 * Los campos vacíos se muestran como placeholders editables en la interfaz:
 * completá el valor y el enlace se activa automáticamente.
 * No se inventó ninguna información: solo se dejó preparado el espacio.
 */
export const CONTACT = {
  email: '', // ej: 'hola@ignaciovilla.com'
  github: 'https://github.com/ignaciovilla398',
  linkedin: '', // ej: 'https://www.linkedin.com/in/ignaciovilla'
  instagram: '', // ej: 'https://www.instagram.com/ignaciovilla'
  location: 'Mar del Plata, Argentina',
} as const

export type ContactKey = keyof typeof CONTACT

/**
 * Links de la navbar.
 * El nombre de la marca (en el logo) es el acceso a Inicio, por eso la lista
 * arranca en Sobre mí. El orden respeta el orden real de las secciones.
 */
export const NAV_LINKS = [
  { index: '01', label: 'Sobre mí', href: '#sobre-mi' },
  { index: '02', label: 'Proyectos', href: '#proyectos' },
  { index: '03', label: 'Servicios', href: '#servicios' },
  { index: '04', label: 'Stack', href: '#stack' },
  { index: '05', label: 'Contacto', href: '#contacto' },
] as const

/**
 * Numeración editorial de las secciones del sitio.
 * Fuente única de verdad para los índices (01), (02), … que aparecen en cada
 * encabezado y en la navegación.
 */
export const SECTION_INDEX = {
  inicio: '00',
  proyectos: '01',
  sobreMi: '02',
  servicios: '03',
  stack: '04',
  proceso: '05',
  manifiesto: '06',
  contacto: '07',
} as const

export type Project = {
  id: string
  index: string
  name: string
  category: string
  /** Categorías individuales para mostrarlas como etiquetas separadas. */
  tags: string[]
  url: string
  description: string
  /** Ruta de la captura del sitio real dentro de /public. */
  screenshot: string
  screenshotAlt: string
  /** Tecnologías verificables del sitio publicado (inspección del markup y assets). */
  stack: string[]
  /** Color de acento usado solo para detalles mínimos de la tarjeta. */
  accent: string
}

export const PROJECTS: Project[] = [
  {
    id: 'jeipi-burgers',
    index: '01',
    name: 'Jeipi Burgers',
    category: 'Web Development · Gastronomía',
    tags: ['Web Development', 'Gastronomía'],
    url: 'https://ignaciovilla398.github.io/JEIPI-BURGERS/',
    description:
      'Desarrollo de una experiencia web para una marca gastronómica de Mar del Plata, con foco en identidad visual, presentación de productos, navegación y conversión.',
    screenshot: './proyectos/jeipi.jpg',
    screenshotAlt: 'Captura del sitio Jeipi Burgers: portada con la marca y el menú de hamburguesas',
    stack: ['HTML', 'CSS', 'JavaScript'],
    accent: '#F2B33D',
  },
  {
    id: 'ambos-y-asociados',
    index: '02',
    name: 'Ambos & Asociados',
    category: 'Web Development · Estudio Jurídico',
    tags: ['Web Development', 'Estudio Jurídico'],
    url: 'https://ignaciovilla398.github.io/ambos-y-asociados/',
    description:
      'Desarrollo de un sitio institucional para un estudio jurídico, priorizando confianza, claridad de información, estructura profesional y experiencia de navegación.',
    screenshot: './proyectos/ambos.jpg',
    screenshotAlt: 'Captura del sitio Ambos & Asociados: portada institucional del estudio jurídico',
    stack: ['HTML', 'CSS', 'JavaScript'],
    accent: '#B99154',
  },
  {
    id: 'social-links-profile',
    index: '03',
    name: 'Social Links Profile',
    category: 'Frontend Development · Frontend Mentor',
    tags: ['Frontend Development', 'Frontend Mentor'],
    url: 'https://ignaciovilla398.github.io/Desafio-3-de-Frontend-mentor/',
    description:
      'Implementación de una interfaz frontend a partir de un desafío de Frontend Mentor, trabajando composición visual, responsive design, tipografía y estructura de componentes.',
    screenshot: './proyectos/social.jpg',
    screenshotAlt: 'Captura del desafío Social Links Profile de Frontend Mentor',
    stack: ['HTML', 'CSS'],
    accent: '#A8D14A',
  },
  {
    id: 'urco-empanadas',
    index: '04',
    name: 'URCO — Empanadas Argentinas',
    category: 'Web Development · Gastronomía',
    tags: ['Web Development', 'Gastronomía'],
    url: 'https://ignaciovilla398.github.io/URCO-empanadas/',
    description:
      'Desarrollo de una landing gastronómica enfocada en identidad de marca, presentación de productos y contacto directo con el negocio.',
    screenshot: './proyectos/urco.jpg',
    screenshotAlt: 'Captura del sitio URCO Empanadas: portada de la marca gastronómica',
    stack: ['HTML', 'CSS'],
    accent: '#D9552F',
  },
]

export const SERVICES = [
  {
    index: '01',
    title: 'Desarrollo Web',
    description: 'Sitios web modernos, responsive y optimizados.',
  },
  {
    index: '02',
    title: 'Landing Pages',
    description: 'Páginas orientadas a presentar productos, servicios o negocios.',
  },
  {
    index: '03',
    title: 'Interfaces',
    description: 'Diseño y desarrollo de interfaces web funcionales y atractivas.',
  },
  {
    index: '04',
    title: 'Experiencias Digitales',
    description: 'Experiencias interactivas pensadas alrededor de una marca o producto.',
  },
  {
    index: '05',
    title: 'Integración de IA',
    description:
      'Exploración e incorporación de herramientas de inteligencia artificial en productos y procesos digitales.',
  },
] as const

/**
 * Stack: solo tecnologías usadas en los proyectos publicados o directamente
 * relacionadas con el stack de este portfolio. `level` describe el estado real:
 * "en uso" = presente en proyectos entregados, "aprendiendo" = en formación.
 */
export const STACK = [
  { name: 'HTML', level: 'En uso', group: 'Base' },
  { name: 'CSS', level: 'En uso', group: 'Base' },
  { name: 'JavaScript', level: 'En uso', group: 'Base' },
  { name: 'TypeScript', level: 'En uso', group: 'Base' },
  { name: 'React', level: 'En uso', group: 'Frontend' },
  { name: 'Tailwind CSS', level: 'En uso', group: 'Frontend' },
  { name: 'Next.js', level: 'Aprendiendo', group: 'Frontend' },
  { name: 'Framer Motion', level: 'En uso', group: 'Frontend' },
  { name: 'Git', level: 'En uso', group: 'Herramientas' },
  { name: 'GitHub', level: 'En uso', group: 'Herramientas' },
  { name: 'GitHub Pages', level: 'En uso', group: 'Herramientas' },
  { name: 'Vite', level: 'En uso', group: 'Herramientas' },
  { name: 'IA aplicada al desarrollo', level: 'Explorando', group: 'IA' },
] as const

export const PROCESS = [
  {
    index: '01',
    title: 'Entender',
    description: 'Comprender la idea, problema o necesidad.',
  },
  {
    index: '02',
    title: 'Diseñar',
    description: 'Definir estructura, contenido y experiencia.',
  },
  {
    index: '03',
    title: 'Desarrollar',
    description: 'Convertir la idea en una experiencia web funcional.',
  },
  {
    index: '04',
    title: 'Iterar',
    description: 'Probar, mejorar y continuar evolucionando el producto.',
  },
] as const

export const MARQUEE_ITEMS = [
  'Desarrollo Web',
  'Diseño Digital',
  'Full Stack',
  'IA',
  'Experiencias Digitales',
  'Interfaces',
  'Producto',
] as const

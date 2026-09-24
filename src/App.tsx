import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Services } from './components/sections/Services'
import { Stack } from './components/sections/Stack'
import { Process } from './components/sections/Process'
import { Philosophy } from './components/sections/Philosophy'
import { Contact } from './components/sections/Contact'

/**
 * Composición del sitio:
 * Navbar → Hero (nombre + pieza 3D flotante) → Proyectos → Marquee → Sobre mí →
 * Capacidades → Stack → Proceso → Filosofía → Contacto → Footer.
 */
export default function App() {
  return (
    <div className="relative min-h-screen bg-ink-950">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:items-center focus:rounded-full focus:bg-bone-50 focus:px-5 focus:py-3 focus:font-mono focus:text-[0.65rem] focus:uppercase focus:tracking-[0.2em] focus:text-ink-950"
      >
        Saltar al contenido
      </a>

      <Navbar />

      <main id="contenido">
        <Hero />
        <Projects />
        <Marquee />
        <About />
        <Services />
        <Stack />
        <Process />
        <Philosophy />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

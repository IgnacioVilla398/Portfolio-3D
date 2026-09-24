import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { SITE } from '../../data/site'
import { HeroHeadStage } from './HeroHead'

const TITLE = ['IGNACIO', 'VILLA']

/**
 * Hero: el nombre arriba, la pieza 3D flotando en el centro justo debajo,
 * y luego la presentación con los dos accesos principales.
 * La sección siguiente es Proyectos.
 */
export function Hero() {
  const prefersReduced = useReducedMotion()

  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
        }

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32"
      aria-label="Presentación"
    >
      {/* Fondo: grilla técnica muy sutil + halo frío detrás de la pieza */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-grid-line bg-grid opacity-[0.5] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-[18rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,140,255,0.16),transparent)] blur-3xl md:top-[20rem]" />
      </div>

      <div className="shell">
        {/* Fila superior: rol + disponibilidad */}
        <motion.div
          {...rise(0.05)}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5"
        >
          <p className="eyebrow">{SITE.role}</p>
          <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Portfolio 2026
          </p>
        </motion.div>

        {/* 1. Nombre: el gesto tipográfico principal, arriba de todo */}
        <h1 className="mt-10 text-center md:mt-14">
          <span className="sr-only">
            {SITE.name} — {SITE.role}
          </span>
          <span aria-hidden="true" className="block">
            {TITLE.map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.02em]">
                <motion.span
                  className={`block text-display-xl font-semibold uppercase ${
                    i === 1 ? 'text-stroke' : ''
                  }`}
                  initial={prefersReduced ? { opacity: 0 } : { y: '108%' }}
                  animate={prefersReduced ? { opacity: 1 } : { y: '0%' }}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.12 + i * 0.1 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        {/* 2. Pieza 3D flotando en el centro, justo debajo del nombre */}
        <motion.div {...rise(0.3)} className="mt-2 md:mt-4">
          <HeroHeadStage />
        </motion.div>

        {/* 3. Presentación + accesos */}
        <div className="mt-10 grid gap-10 border-t border-white/[0.07] pt-10 md:mt-12 md:grid-cols-12 md:gap-12">
          <motion.p
            {...rise(0.45)}
            className="text-lg leading-relaxed text-bone-200 md:col-span-6 md:max-w-xl md:text-xl"
          >
            {SITE.intro}
          </motion.p>

          <motion.div
            {...rise(0.55)}
            className="flex flex-col gap-6 md:col-span-6 md:items-end md:justify-between"
          >
            <p className="font-mono text-[0.68rem] uppercase leading-[2] tracking-[0.18em] text-bone-500 md:text-right">
              Cuatro proyectos reales publicados
              <br />
              Web · Interfaces · Producto
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#proyectos" className="btn-primary group">
                Ver proyectos
                <ArrowDown
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <a href="#contacto" className="btn-ghost group">
                Contactarme
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

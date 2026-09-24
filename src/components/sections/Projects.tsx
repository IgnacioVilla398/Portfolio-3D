import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS, SECTION_INDEX, type Project } from '../../data/site'
import { Section } from '../primitives/Section'
import { Reveal } from '../primitives/Reveal'

/**
 * Una pieza de proyecto presentada de forma editorial.
 * La composición alterna izquierda/derecha y aparece progresivamente
 * al entrar en viewport.
 */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const isReversed = index % 2 === 1

  return (
    <motion.article
      ref={ref}
      initial={prefersReduced ? false : { opacity: 0, y: 46 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group/row grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12"
      aria-labelledby={`proyecto-${project.id}`}
    >
      {/* Captura del sitio real */}
      <div className={`md:col-span-7 ${isReversed ? 'md:col-start-6 md:order-2' : 'md:col-start-1'}`}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-2xl border border-white/[0.10] bg-ink-900 shadow-frame transition-all duration-700 ease-editorial hover:-translate-y-1 hover:border-white/30 hover:shadow-glow"
          aria-label={`Ver el proyecto ${project.name} (se abre en una nueva pestaña)`}
        >
          <div className="relative overflow-hidden">
            <img
              src={project.screenshot}
              alt={project.screenshotAlt}
              width={1440}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.02]"
            />

            {/* Barra tipo ventana: refuerza la lectura de "sitio web real".
                Muy liviana para no tapar la captura. */}
            <span className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-1.5 bg-gradient-to-b from-ink-950/75 to-transparent px-3 pb-6 pt-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white/50" aria-hidden="true" />
              <span className="h-2 w-2 shrink-0 rounded-full bg-white/30" aria-hidden="true" />
              <span className="h-2 w-2 shrink-0 rounded-full bg-white/20" aria-hidden="true" />
              <span className="ml-3 min-w-0 truncate font-mono text-[0.58rem] leading-none tracking-wide text-bone-100/90">
                {project.url.replace('https://', '')}
              </span>
            </span>

            {/* Indicador de apertura, siempre visible y más marcado en hover */}
            <span
              className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-ink-950/85 text-bone-50 backdrop-blur-md transition-all duration-700 ease-editorial group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950"
              aria-hidden="true"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </a>
      </div>

      {/* Información del proyecto */}
      <div className={`md:col-span-5 ${isReversed ? 'md:order-1 md:col-start-1' : 'md:col-start-8'}`}>
        <div className="flex items-baseline gap-4">
          <span
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tracking-tight text-white/10 transition-colors duration-700 group-hover/row:text-white/20"
            aria-hidden="true"
          >
            {project.index}
          </span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>

        <h3
          id={`proyecto-${project.id}`}
          className="mt-5 text-display-sm font-semibold tracking-tight text-bone-50"
        >
          {project.name}
        </h3>

        <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          {project.tags.map((tag, i) => (
            <li key={tag} className="flex items-center gap-3">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-400">{tag}</span>
              {i < project.tags.length - 1 ? (
                <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-200 md:text-base">
          {project.description}
        </p>

        <dl className="mt-6 flex flex-wrap items-center gap-2">
          <dt className="sr-only">Tecnologías utilizadas</dt>
          {project.stack.map((tech) => (
            <dd
              key={tech}
              className="rounded-full border border-white/[0.12] bg-white/[0.03] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-bone-300"
            >
              {tech}
            </dd>
          ))}
        </dl>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-8 inline-flex items-center gap-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-bone-50 transition-colors duration-500 hover:text-accent-soft"
        >
          <span className="relative">
            Ver proyecto
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white/25 transition-transform duration-700 ease-editorial group-hover/link:scale-x-0" />
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-700 ease-editorial group-hover/link:scale-x-100" />
          </span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
            aria-hidden="true"
          />
          <span className="sr-only">(se abre en una nueva pestaña)</span>
        </a>
      </div>
    </motion.article>
  )
}

export function Projects() {
  return (
    <Section id="proyectos" className="border-t border-white/[0.07]">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[0.7rem] text-accent">({SECTION_INDEX.proyectos})</span>
        <span className="h-px w-10 bg-white/15" aria-hidden="true" />
        <span className="eyebrow">Proyectos</span>
      </div>

      <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <h2 className="text-display-md max-w-2xl">
            Trabajo real,
            <br />
            publicado y navegable.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="md:pb-3">
          <p className="max-w-sm text-sm leading-relaxed text-bone-400">
            Una selección de interfaces y experiencias web que desarrollé. Cada pieza se abre en su sitio real.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 flex flex-col gap-[clamp(4rem,9vw,8rem)] md:mt-24">
        {PROJECTS.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}

import { ArrowUpRight } from 'lucide-react'
import { SERVICES, SECTION_INDEX } from '../../data/site'
import { Section } from '../primitives/Section'
import { Reveal } from '../primitives/Reveal'
import { Stagger, StaggerItem } from '../primitives/Stagger'

/**
 * Capacidades: se presentan como áreas de trabajo actuales e intereses,
 * no como una lista de servicios comerciales ya ofrecidos.
 */
export function Services() {
  return (
    <Section id="servicios" className="border-t border-white/[0.07]">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[0.7rem] text-accent">({SECTION_INDEX.servicios})</span>
        <span className="h-px w-10 bg-white/15" aria-hidden="true" />
        <span className="eyebrow">Servicios / Capacidades</span>
      </div>

      <Reveal className="mt-10 md:mt-14">
        <h2 className="text-display-md max-w-3xl">Lo que puedo construir</h2>
      </Reveal>

      <Stagger className="mt-12 border-t border-white/[0.07] md:mt-16" stagger={0.06}>
        {SERVICES.map((service) => (
          <StaggerItem key={service.index}>
            <div className="group grid grid-cols-1 gap-3 border-b border-white/[0.07] py-7 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline md:gap-8 md:py-9">
              <span className="font-mono text-[0.65rem] text-bone-500 transition-colors duration-500 group-hover:text-accent md:col-span-1">
                {service.index}
              </span>
              <h3 className="text-display-sm font-medium tracking-tight text-bone-100 transition-transform duration-700 ease-editorial md:col-span-5 md:group-hover:translate-x-1.5">
                {service.title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-bone-400 md:col-span-5">
                {service.description}
              </p>
              <span className="hidden justify-end md:col-span-1 md:flex">
                <ArrowUpRight
                  className="h-5 w-5 text-bone-500 opacity-0 transition-all duration-700 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mt-8">
        <p className="max-w-2xl font-mono text-[0.65rem] uppercase leading-[2] tracking-[0.16em] text-bone-500">
          Estas son mis capacidades actuales y las áreas que sigo explorando, no una lista de servicios
          profesionales ya ofrecidos de forma comercial.
        </p>
      </Reveal>
    </Section>
  )
}

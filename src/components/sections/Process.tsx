import { PROCESS, SECTION_INDEX } from '../../data/site'
import { Section } from '../primitives/Section'
import { Reveal } from '../primitives/Reveal'
import { Stagger, StaggerItem } from '../primitives/Stagger'

/** Proceso de trabajo en cuatro pasos, con una línea que los conecta. */
export function Process() {
  return (
    <Section id="proceso" className="border-t border-white/[0.07]">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[0.7rem] text-accent">({SECTION_INDEX.proceso})</span>
        <span className="h-px w-10 bg-white/15" aria-hidden="true" />
        <span className="eyebrow">Proceso</span>
      </div>

      <Reveal className="mt-10 md:mt-14">
        <h2 className="text-display-md max-w-2xl">Cómo trabajo</h2>
      </Reveal>

      <Stagger className="relative mt-14 md:mt-20" stagger={0.1}>
        {/* Línea horizontal que recorre los pasos en desktop */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[0.55rem] hidden h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent lg:block"
        />

        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PROCESS.map((step) => (
            <StaggerItem key={step.index}>
              <li className="group relative">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full border border-white/25 bg-ink-950 transition-colors duration-500 group-hover:border-accent group-hover:bg-accent" />
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-bone-500">
                    {step.index}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold uppercase tracking-tight text-bone-50">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-400">{step.description}</p>
              </li>
            </StaggerItem>
          ))}
        </ol>
      </Stagger>
    </Section>
  )
}

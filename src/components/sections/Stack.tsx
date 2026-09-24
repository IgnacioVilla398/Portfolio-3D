import { SECTION_INDEX, STACK } from '../../data/site'
import { Section } from '../primitives/Section'
import { Reveal } from '../primitives/Reveal'
import { Stagger, StaggerItem } from '../primitives/Stagger'

const LEVEL_STYLES: Record<string, string> = {
  'En uso': 'text-accent-soft border-accent/30',
  Aprendiendo: 'text-bone-300 border-white/15',
  Explorando: 'text-bone-300 border-white/15',
}

/**
 * Stack: solo tecnologías usadas en los proyectos publicados o relacionadas
 * con el stack de este portfolio. El estado se declara de forma explícita.
 */
export function Stack() {
  const groups = Array.from(new Set(STACK.map((item) => item.group)))

  return (
    <Section id="stack" className="border-t border-white/[0.07]">
      <div className="grid gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16 lg:gap-x-16">
        <div className="md:col-span-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.7rem] text-accent">({SECTION_INDEX.stack})</span>
            <span className="h-px w-10 bg-white/15" aria-hidden="true" />
            <span className="eyebrow">Stack</span>
          </div>
          <Reveal className="mt-8">
            <h2 className="text-display-sm">Herramientas que uso hoy</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-400">
              Lo que aparece como “en uso” está presente en proyectos entregados y publicados. El resto son
              tecnologías que estoy incorporando.
            </p>
          </Reveal>
        </div>

        <Stagger className="min-w-0 md:col-span-8 md:col-start-6" stagger={0.04}>
          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group}>
                <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-bone-500">{group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {STACK.filter((item) => item.group === group).map((item) => (
                    <StaggerItem key={item.name}>
                      <li
                        className={`inline-flex items-center gap-2 rounded-full border bg-ink-900/60 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors duration-500 hover:bg-ink-850 ${
                          LEVEL_STYLES[item.level] ?? 'text-bone-300 border-white/15'
                        }`}
                      >
                        {item.name}
                        <span className="text-[0.55rem] tracking-[0.1em] opacity-75">{item.level}</span>
                      </li>
                    </StaggerItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Stagger>
      </div>
    </Section>
  )
}

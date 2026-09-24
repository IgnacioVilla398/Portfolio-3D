import { SECTION_INDEX } from '../../data/site'
import { Section } from '../primitives/Section'
import { Reveal } from '../primitives/Reveal'
import { LineReveal } from '../primitives/LineReveal'
import { Stagger, StaggerItem } from '../primitives/Stagger'

const ENFOQUE = [
  {
    index: '01',
    title: 'Aprender construyendo',
    text: 'Cada proyecto nuevo es la excusa para incorporar algo que todavía no sabía hacer.',
  },
  {
    index: '02',
    title: 'Resolver problemas reales',
    text: 'Trabajo sobre necesidades concretas: mostrar un menú, ordenar información, facilitar un contacto.',
  },
  {
    index: '03',
    title: 'Mejorar continuamente',
    text: 'Vuelvo sobre lo que ya hice para corregir, ordenar y dejar el código más claro que antes.',
  },
  {
    index: '04',
    title: 'Experimentar con tecnología',
    text: 'Pruebo herramientas y enfoques modernos para ver qué mejora de verdad la experiencia.',
  },
  {
    index: '05',
    title: 'IA dentro del proceso',
    text: 'Uso herramientas de inteligencia artificial como apoyo para pensar, prototipar y acelerar el desarrollo.',
  },
] as const

export function About() {
  return (
    <Section id="sobre-mi">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[0.7rem] text-accent">({SECTION_INDEX.sobreMi})</span>
        <span className="h-px w-10 bg-white/15" aria-hidden="true" />
        <span className="eyebrow">Sobre mí</span>
      </div>

      <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <LineReveal
            as="h2"
            className="text-display-md"
            lines={['Construyendo mi camino', 'en tecnología, un', 'proyecto a la vez.']}
          />

          <Reveal delay={0.15} className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-bone-300 md:text-lg">
            <p>
              Soy Ignacio Villa, desarrollador web en formación y creador de proyectos digitales. Me interesa
              combinar desarrollo, diseño y nuevas tecnologías para crear experiencias web modernas, útiles y
              visualmente atractivas.
            </p>
            <p>
              Mi forma de trabajar parte de la práctica: armo, publico y vuelvo sobre lo que hice. Así aprendo
              construyendo, resuelvo problemas reales y voy afinando mi manera de desarrollar. Me interesa
              especialmente experimentar con tecnologías modernas y sumar herramientas de inteligencia artificial
              al proceso de trabajo.
            </p>
          </Reveal>
        </div>

        <Stagger className="md:col-span-5 md:col-start-8" stagger={0.07}>
          <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {ENFOQUE.map((item) => (
              <StaggerItem key={item.index}>
                <li className="group flex gap-5 py-5 transition-colors duration-500 hover:bg-white/[0.02]">
                  <span className="mt-1 font-mono text-[0.65rem] text-bone-500 transition-colors duration-500 group-hover:text-accent">
                    {item.index}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-medium tracking-tight text-bone-50">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-bone-400">{item.text}</p>
                  </div>
                </li>
              </StaggerItem>
            ))}
          </ul>
        </Stagger>
      </div>
    </Section>
  )
}

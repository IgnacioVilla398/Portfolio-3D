import { SECTION_INDEX } from '../../data/site'
import { LineReveal } from '../primitives/LineReveal'
import { Reveal } from '../primitives/Reveal'

/**
 * Manifiesto: el momento emocional del sitio.
 * Fondo oscuro con textura mínima, sin efectos pesados.
 */
export function Philosophy() {
  return (
    <section
      id="manifiesto"
      aria-label="Filosofía de trabajo"
      className="relative overflow-hidden border-y border-white/[0.07] bg-ink-900 py-[clamp(5rem,12vw,11rem)]"
    >
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,140,255,0.10),transparent)] blur-3xl"
      />

      <div className="shell relative">
        <span className="eyebrow block text-center">Filosofía · ({SECTION_INDEX.manifiesto})</span>

        <LineReveal
          as="h2"
          className="mx-auto mt-10 max-w-4xl text-center text-display-md"
          lines={['No quiero limitarme a escribir código.', 'Quiero construir cosas que tengan un propósito.']}
        />

        <Reveal delay={0.2} className="mx-auto mt-10 max-w-2xl">
          <p className="text-center text-base leading-relaxed text-bone-300 md:text-lg">
            Cada proyecto es una oportunidad para aprender algo nuevo, mejorar mi forma de trabajar y acercarme un
            poco más a la clase de desarrollador que quiero ser.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-14 flex justify-center">
          <span className="h-16 w-px bg-gradient-to-b from-white/30 to-transparent" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  )
}

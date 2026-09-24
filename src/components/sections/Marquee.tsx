import { MARQUEE_ITEMS } from '../../data/site'

/**
 * Marquee editorial: movimiento lento y continuo.
 * Se pausa al pasar el mouse y se detiene por completo con
 * `prefers-reduced-motion` (regla definida en globals.css).
 */
export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <section
      aria-label="Áreas de trabajo"
      className="relative border-y border-white/[0.07] py-6 md:py-8"
    >
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-8 hover:[animation-play-state:paused] md:gap-14">
          {items.map((item, i) => (
            <div key={`${item}-${i}`} className="flex shrink-0 items-center gap-8 md:gap-14" aria-hidden={i >= MARQUEE_ITEMS.length}>
              <span className="font-display text-[clamp(1.1rem,2.4vw,2rem)] font-medium uppercase tracking-tight text-bone-300">
                {item}
              </span>
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

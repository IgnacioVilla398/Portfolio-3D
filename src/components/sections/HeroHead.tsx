import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '../../data/site'

const HEAD_SRC = './brand/ignacio-villa-head.jpg'

/**
 * Pieza 3D del hero: la cabeza flota dinámicamente en el centro, sin marco.
 * - Entrada suave al cargar (fade + escala).
 * - Loop idle continuo (sube y baja) que se desactiva con `prefers-reduced-motion`.
 * - Máscara circular que funde los bordes de la imagen con el fondo oscuro.
 */
export function HeroHead({ className = '' }: { className?: string }) {
  const prefersReduced = useReducedMotion()

  return (
    <figure className={`relative ${className}`}>
      {/* Halo frío detrás de la pieza */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,140,255,0.22),transparent_72%)] blur-2xl"
      />

      {/* Anillo fino: da profundidad y refuerza la sensación de levitación */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.10] bg-[radial-gradient(closest-side,rgba(79,140,255,0.08),transparent_78%)]"
      />

      {/* Pieza flotante */}
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.96 }}
        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className={`relative will-change-transform ${prefersReduced ? '' : 'animate-float'}`}
      >
        <img
          src={HEAD_SRC}
          alt={`Retrato 3D de ${SITE.name}`}
          width={880}
          height={1056}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="mask-circle h-auto w-full object-contain"
        />
      </motion.div>

      {/* Detalle editorial bajo la pieza */}
      <figcaption className="mt-3 text-center font-mono text-[0.58rem] uppercase tracking-[0.3em] text-bone-500">
        Retrato 3D · pieza viva
      </figcaption>
    </figure>
  )
}

/**
 * Escenario de la pieza: la centra dentro del hero con marcas de encuadre
 * laterales y sin reservar caja (nada de marcos ni recortes rectangulares).
 */
export function HeroHeadStage({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center gap-4 md:gap-12 ${className}`}>
      <span aria-hidden="true" className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-white/15 sm:block" />

      <HeroHead className="w-[clamp(13rem,54vw,22rem)] shrink-0" />

      <span aria-hidden="true" className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-white/15 sm:block" />
    </div>
  )
}

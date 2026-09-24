import type { Variants, Transition } from 'framer-motion'

/**
 * Curva editorial compartida: arranca rápido y frena suave.
 * Se usa en todas las transiciones para mantener coherencia visual.
 */
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const

export const baseTransition: Transition = {
  duration: 0.75,
  ease: EASE_EDITORIAL,
}

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

/** Aparición estándar: sube levemente y aparece. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
}

/** Aparición suave, sin desplazamiento (para bloques grandes). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_EDITORIAL } },
}

/** Aparición con una escala muy leve, para piezas visuales. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 18 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.85, ease: EASE_EDITORIAL } },
}

/** Reveal por máscara: el texto sube desde detrás de una línea. */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE_EDITORIAL } },
}

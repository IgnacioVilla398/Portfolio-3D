import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../../lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Retardo en segundos antes de iniciar la animación. */
  delay?: number
  /** Nivel de visibilidad necesario para disparar la animación (0–1). */
  amount?: number
  once?: boolean
}

/**
 * Envoltorio de animación reutilizable.
 * - Se anima una sola vez, al entrar en viewport.
 * - Con `prefers-reduced-motion` el contenido aparece sin desplazamiento.
 */
export function Reveal({ children, className, delay = 0, amount = 0.2, once = true }: RevealProps) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

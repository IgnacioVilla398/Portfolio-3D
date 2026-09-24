import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer } from '../../lib/motion'

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
  amount?: number
}

/** Contenedor que revela a sus hijos de forma escalonada al entrar en viewport. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  amount = 0.15,
}: StaggerProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

/** Hijo de <Stagger />: hereda el estado del contenedor. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}

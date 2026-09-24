import { useReducedMotion, motion } from 'framer-motion'
import { maskUp } from '../../lib/motion'

type LineRevealProps = {
  /** Una entrada por línea: se animan con un pequeño escalonado. */
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  /** Etiqueta HTML del bloque contenedor. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  ariaLabel?: string
}

/**
 * Reveal tipográfico por líneas: cada línea sube desde detrás de una máscara.
 * Es el gesto principal de la dirección de arte del sitio.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = 'div',
  ariaLabel,
}: LineRevealProps) {
  const prefersReduced = useReducedMotion()
  const Tag = as

  if (prefersReduced) {
    return (
      <Tag className={className} aria-label={ariaLabel}>
        {lines.map((line, i) => (
          <span key={`${i}-${line}`} className={`block ${lineClassName ?? ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={className} aria-label={ariaLabel}>
      {lines.map((line, i) => (
        <span key={`${i}-${line}`} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            variants={maskUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

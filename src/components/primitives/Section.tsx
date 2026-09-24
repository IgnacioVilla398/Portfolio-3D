import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  children: ReactNode
  className?: string
  /** Etiqueta de accesibilidad si el título visible no alcanza como nombre. */
  ariaLabel?: string
}

/**
 * Sección semántica reutilizable: aporta el ritmo vertical del sitio
 * y el anclaje de navegación. El scroll-margin compensa la navbar fija.
 */
export function Section({ id, children, className = '', ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`section-y scroll-mt-24 ${className}`}
    >
      <div className="shell">{children}</div>
    </section>
  )
}

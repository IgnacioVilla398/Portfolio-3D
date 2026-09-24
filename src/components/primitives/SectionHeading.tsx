import type { ReactNode } from 'react'

type SectionHeadingProps = {
  /** Numeración editorial de la sección, ej. "02". */
  index?: string
  label: string
  title?: ReactNode
  subtitle?: string
  className?: string
  align?: 'left' | 'between'
}

/**
 * Encabezado de sección reutilizable: numeración + etiqueta mono,
 * con espacio para un título grande y un subtítulo.
 */
export function SectionHeading({
  index,
  label,
  title,
  subtitle,
  className = '',
  align = 'left',
}: SectionHeadingProps) {
  return (
    <header className={className}>
      <div className="flex items-center gap-4">
        {index ? <span className="font-mono text-[0.7rem] text-accent">({index})</span> : null}
        <span className="h-px w-10 bg-white/15" aria-hidden="true" />
        <span className="eyebrow">{label}</span>
      </div>

      {title ? (
        <div className={align === 'between' ? 'mt-8 md:flex md:items-end md:justify-between md:gap-12' : 'mt-8'}>
          <h2 className="text-display-md max-w-3xl">{title}</h2>
          {subtitle ? (
            <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-400 md:mt-0 md:pb-2">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}

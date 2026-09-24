import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { NAV_LINKS, SITE } from '../../data/site'

/**
 * Navbar fija: transparente sobre el hero y con fondo translúcido + borde
 * una vez que el usuario hace scroll. En mobile se convierte en menú hamburguesa.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del documento mientras el menú mobile está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Cierra el menú con Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial ${
        scrolled
          ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="shell flex h-[4.5rem] items-center justify-between gap-6 md:h-20" aria-label="Navegación principal">
        <a
          href="#inicio"
          className="group inline-flex items-baseline gap-2 py-1 font-display text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-bone-50"
          onClick={() => setOpen(false)}
        >
          <span className="transition-colors duration-500 group-hover:text-accent-soft">{SITE.name}</span>
          <span className="mb-[0.15rem] h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        </a>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group inline-flex items-center gap-2 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-bone-300 transition-colors duration-300 hover:text-bone-50"
              >
                <span className="text-[0.6rem] text-bone-500 transition-colors duration-300 group-hover:text-accent">
                  {link.index}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contacto"
            className="hidden items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-bone-100 transition-all duration-500 ease-editorial hover:border-white/40 hover:bg-white/[0.05] md:inline-flex"
          >
            Hablemos
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone-100 transition-colors duration-300 hover:bg-white/[0.05] lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-mobile"
            key="menu"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="shell flex flex-col divide-y divide-white/[0.06] py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 font-display text-2xl tracking-tight text-bone-100"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-bone-500">{link.index}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="shell pb-8 pt-2">
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Hablemos
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

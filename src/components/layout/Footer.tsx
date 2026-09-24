import { ArrowUp } from 'lucide-react'
import { CONTACT, NAV_LINKS, PROJECTS, SITE } from '../../data/site'

const FOOTER_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contacto', href: '#contacto' },
]

const SOCIALS = [
  { label: 'GitHub', href: CONTACT.github },
  { label: 'LinkedIn', href: CONTACT.linkedin },
  { label: 'Instagram', href: CONTACT.instagram },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-lg font-semibold uppercase tracking-[0.16em] text-bone-50">
              {SITE.name}
            </p>
            <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone-400">
              {SITE.role}
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone-500">{SITE.tagline}</p>
          </div>

          <nav className="md:col-span-4" aria-label="Navegación del pie de página">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-bone-500">Navegación</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline inline-block py-1.5 text-sm text-bone-300 transition-colors duration-500 hover:text-bone-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-bone-500">Canales</p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((social) =>
                social.href ? (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-block py-1.5 text-sm text-bone-300 transition-colors duration-500 hover:text-bone-50"
                    >
                      {social.label}
                    </a>
                  </li>
                ) : (
                  <li key={social.label} className="text-sm text-bone-500/70">
                    {social.label} <span className="font-mono text-[0.55rem] uppercase">· próximamente</span>
                  </li>
                ),
              )}
              {CONTACT.email ? (
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="link-underline inline-block py-2 text-sm text-bone-300 transition-colors duration-500 hover:text-bone-50"
                  >
                    Email
                  </a>
                </li>
              ) : (
                <li className="text-sm text-bone-500/70">
                  Email <span className="font-mono text-[0.55rem] uppercase">· próximamente</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Índice de proyectos, detalle de archivo */}
        <div className="mt-14 border-t border-white/[0.06] pt-8">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-bone-500">Archivo de proyectos</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {PROJECTS.map((project) => (
              <li key={project.id}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-block py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-bone-400 transition-colors duration-500 hover:text-bone-100"
                >
                  {project.index} — {project.name.split('—')[0].trim()}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-bone-500">
            © 2026 {SITE.name}. Todos los derechos reservados.
          </p>

          <nav
            aria-label="Navegación rápida"
            className="flex flex-wrap items-center gap-x-5 gap-y-1 md:gap-x-6"
          >
            {NAV_LINKS.slice(0, 2).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-block py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-bone-500 transition-colors duration-500 hover:text-bone-200"
              >
                {link.index} {link.label}
              </a>
            ))}
            <a
              href="#inicio"
              className="group inline-flex items-center gap-2 py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-bone-400 transition-colors duration-500 hover:text-bone-100"
            >
              Volver arriba
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CONTACT, SECTION_INDEX, SITE } from '../../data/site'
import { Reveal } from '../primitives/Reveal'
import { LineReveal } from '../primitives/LineReveal'

type ContactItem = {
  key: string
  label: string
  /** Valor real si existe; si está vacío se muestra como placeholder editable. */
  value: string
  href?: string
  icon: LucideIcon
  hint: string
}

const ITEMS: ContactItem[] = [
  {
    key: 'email',
    label: 'Email',
    value: CONTACT.email,
    href: CONTACT.email ? `mailto:${CONTACT.email}` : undefined,
    icon: Mail,
    hint: 'Completar en src/data/site.ts → CONTACT.email',
  },
  {
    key: 'github',
    label: 'GitHub',
    value: CONTACT.github ? '@ignaciovilla398' : '',
    href: CONTACT.github || undefined,
    icon: Github,
    hint: 'Completar en src/data/site.ts → CONTACT.github',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: CONTACT.linkedin,
    href: CONTACT.linkedin || undefined,
    icon: Linkedin,
    hint: 'Completar en src/data/site.ts → CONTACT.linkedin',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    value: CONTACT.instagram,
    href: CONTACT.instagram || undefined,
    icon: Instagram,
    hint: 'Completar en src/data/site.ts → CONTACT.instagram',
  },
]

/**
 * Contacto: cierre del sitio.
 * No se inventó ningún dato: los canales sin información quedan visibles
 * como placeholders fáciles de completar en un único archivo de datos.
 */
export function Contact() {
  const hasEmail = Boolean(CONTACT.email)

  return (
    <section id="contacto" className="section-y scroll-mt-24" aria-label="Contacto">
      <div className="shell">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.7rem] text-accent">({SECTION_INDEX.contacto})</span>
          <span className="h-px w-10 bg-white/15" aria-hidden="true" />
          <span className="eyebrow">Contacto</span>
        </div>

        <div className="mt-10 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <LineReveal as="h2" className="text-display-lg" lines={['¿Tenés', 'una idea?']} />

            <Reveal delay={0.15} className="mt-8 max-w-xl">
              <p className="text-base leading-relaxed text-bone-300 md:text-lg">
                Si estás trabajando en un proyecto, negocio o idea digital y querés convertirla en una experiencia
                web, hablemos.
              </p>
            </Reveal>

            <Reveal delay={0.25} className="mt-10">
              {hasEmail ? (
                <a href={`mailto:${CONTACT.email}`} className="btn-primary group">
                  Contactarme
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <div className="flex flex-col gap-3">
                  <a href="#canales" className="btn-primary group">
                    Contactarme
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-bone-500">
                    El email todavía no está cargado — mirá los canales disponibles abajo.
                  </p>
                </div>
              )}
            </Reveal>
          </div>

          {/* Tarjeta de identidad + canales */}
          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={0.2}>
              <div className="surface p-7 md:p-8">
                <p className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-bone-50">
                  {SITE.name}
                </p>
                <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone-400">
                  {SITE.role}
                </p>
                <p className="mt-5 flex items-center gap-2 text-sm text-bone-400">
                  <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                  {CONTACT.location}
                </p>

                <div className="hairline my-7" />

                <ul id="canales" className="space-y-1 scroll-mt-28">
                  {ITEMS.filter((item) => item.key !== 'email' || Boolean(CONTACT.email)).map((item) => {
                    const Icon = item.icon
                    const available = Boolean(item.href)

                    return (
                      <li key={item.key}>
                        {available ? (
                          <a
                            href={item.href}
                            target={item.key === 'email' ? undefined : '_blank'}
                            rel={item.key === 'email' ? undefined : 'noopener noreferrer'}
                            className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-colors duration-500 hover:bg-white/[0.04]"
                          >
                            <Icon className="h-4 w-4 text-bone-400 transition-colors duration-500 group-hover:text-accent" aria-hidden="true" />
                            <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-bone-400">
                              {item.label}
                            </span>
                            <span className="ml-auto flex items-center gap-2 text-sm text-bone-200">
                              {item.value || 'Disponible'}
                              <ArrowUpRight
                                className="h-3.5 w-3.5 text-bone-500 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                                aria-hidden="true"
                              />
                            </span>
                          </a>
                        ) : (
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-dashed border-white/[0.10] px-3 py-3">
                            <Icon className="h-4 w-4 text-bone-500" aria-hidden="true" />
                            <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-bone-400">
                              {item.label}
                            </span>
                            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-bone-500">
                              Próximamente
                            </span>
                            <span className="w-full font-mono text-[0.56rem] leading-relaxed tracking-wide text-bone-500/80">
                              {item.hint}
                            </span>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

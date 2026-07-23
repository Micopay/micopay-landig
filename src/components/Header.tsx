import { useState } from 'react'
import { useI18n } from '../i18n'

export default function Header() {
  const { t, lang, toggleLang } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '#como-funciona', label: t.nav.howItWorks },
    { href: '#proveedores', label: t.nav.merchants },
    { href: '#seguridad', label: t.nav.trust },
    { href: '#faq', label: t.nav.faq },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-border-light">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <svg fill="none" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="3" stroke="#1A2830" strokeWidth="2"></circle>
              <circle cx="17" cy="17" r="3" stroke="#1D9E75" strokeWidth="2"></circle>
              <path d="M10 10L14 14" stroke="#00694C" strokeLinecap="round" strokeWidth="2"></path>
            </svg>
            <span className="font-heading font-bold text-xl">
              <span className="text-text-primary">Mico</span>
              <span className="text-accent-dark">Pay</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 text-xs font-bold uppercase rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>

            {/* CTA */}
            <a
              href="#proveedores"
              className="hidden sm:inline-flex px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t.hero.cta}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-text-primary">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-light">
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-container rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#proveedores"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 px-5 py-3 bg-primary text-white text-sm font-bold rounded-xl text-center"
              >
                {t.hero.cta}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

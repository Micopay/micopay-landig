import { useState } from 'react'
import { useI18n } from '../i18n'

export default function Footer() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-text-primary text-white transition-colors duration-300">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg fill="none" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="3" stroke="white" strokeWidth="2"></circle>
                <circle cx="17" cy="17" r="3" stroke="#5DCAA5" strokeWidth="2"></circle>
                <path d="M10 10L14 14" stroke="#5DCAA5" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
              <span className="font-heading font-bold text-xl">
                <span className="text-white">Mico</span>
                <span className="text-accent">Pay</span>
              </span>
            </div>
            <p className="text-white/70 mb-6 max-w-sm">
              {t.footer.description}
            </p>
            
            <div className="flex gap-3">
              <a href="https://apps.apple.com/app/micopay" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors" aria-label="Descargar en App Store">
                <span className="material-symbols-outlined">phone_iphone</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/60">Descargar en</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </a>
              <a href="https://play.google.com/store/apps/details?id=app.micopay" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors" aria-label="Disponible en Google Play">
                <span className="material-symbols-outlined">android</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/60">Disponible en</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t.footer.links.product}</h4>
            <ul className="space-y-3">
              <li><a href="#como-funciona" className="text-white/70 hover:text-white transition-colors">{t.footer.product[0]}</a></li>
              <li><a href="#proveedores" className="text-white/70 hover:text-white transition-colors">{t.footer.product[1]}</a></li>
              <li><a href="#seguridad" className="text-white/70 hover:text-white transition-colors">{t.footer.product[2]}</a></li>
              <li><a href="#faq" className="text-white/70 hover:text-white transition-colors">{t.footer.product[3]}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t.footer.links.company}</h4>
            <ul className="space-y-3">
              <li><a href="https://github.com/Micopay" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">{t.footer.company[0]}</a></li>
              <li><a href="mailto:contacto@micopay.app" className="text-white/70 hover:text-white transition-colors">{t.footer.company[1]}</a></li>
              <li><a href="#faq" className="text-white/70 hover:text-white transition-colors">{t.footer.company[2]}</a></li>
            </ul>
            <div className="mt-4">
              <a
                href="https://github.com/Micopay/micopay-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 hover:text-white transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Open Source en GitHub
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t.footer.links.legal}</h4>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-white/70 hover:text-white transition-colors">{t.footer.legal[0]}</a></li>
              <li><a href="/terms" className="text-white/70 hover:text-white transition-colors">{t.footer.legal[1]}</a></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="font-heading font-bold mb-1">{t.footer.newsletter}</h4>
              <p className="text-white/60 text-sm">Las últimas novedades de MicoPay</p>
            </div>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-accent">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="font-medium">¡Gracias por suscribirte!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  className="flex-1 md:w-64 px-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
                >
                  {t.footer.subscribe}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  )
}

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
    <footer className="bg-text-primary dark:bg-[#060D14] text-white transition-colors duration-300">
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
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined">phone_iphone</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/60">Descargar en</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined">android</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/60">Disponible en</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t.footer.links.product}</h4>
            <ul className="space-y-3">
              {t.footer.product.map(item => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t.footer.links.company}</h4>
            <ul className="space-y-3">
              {t.footer.company.map(item => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t.footer.links.legal}</h4>
            <ul className="space-y-3">
              {t.footer.legal.map(item => (
                <li key={item}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
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

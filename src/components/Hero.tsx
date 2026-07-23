import { useI18n } from '../i18n'

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary/20 rounded-full mb-6">
              <span className="material-symbols-outlined text-primary dark:text-accent text-sm">location_on</span>
              <span className="text-sm font-medium text-primary dark:text-accent">{t.hero.merchants}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-text-primary dark:text-dark-text-primary mb-6 leading-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#proveedores"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-accent-dark transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">search</span>
                {t.hero.cta}
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary dark:border-accent text-primary dark:text-accent font-bold rounded-2xl hover:bg-primary-light dark:hover:bg-primary/20 transition-colors"
              >
                {t.nav.howItWorks}
                <span className="material-symbols-outlined">arrow_downward</span>
              </a>
            </div>
          </div>

          {/* Visual - Map Preview */}
          <div className="relative">
            <div className="relative bg-white dark:bg-dark-surface rounded-3xl shadow-2xl p-6 border border-border-light dark:border-dark-border overflow-hidden transition-colors duration-300">
              {/* Map Background */}
              <div className="aspect-square bg-gradient-to-br from-primary-light/50 to-accent/20 dark:from-dark-surface-container dark:to-dark-surface-container-high rounded-2xl relative overflow-hidden">
                {/* Decorative map elements */}
                <div className="absolute inset-0 opacity-30">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#00694C" strokeWidth="0.5" opacity="0.3" />
                    <line x1="0" y1="200" x2="400" y2="200" stroke="#00694C" strokeWidth="0.5" opacity="0.3" />
                    <line x1="0" y1="300" x2="400" y2="300" stroke="#00694C" strokeWidth="0.5" opacity="0.3" />
                    <line x1="100" y1="0" x2="100" y2="400" stroke="#00694C" strokeWidth="0.5" opacity="0.3" />
                    <line x1="200" y1="0" x2="200" y2="400" stroke="#00694C" strokeWidth="0.5" opacity="0.3" />
                    <line x1="300" y1="0" x2="300" y2="400" stroke="#00694C" strokeWidth="0.5" opacity="0.3" />
                    {/* Roads */}
                    <path d="M50,200 Q200,180 350,200" stroke="#00694C" strokeWidth="2" fill="none" opacity="0.4" />
                    <path d="M200,50 Q180,200 200,350" stroke="#00694C" strokeWidth="2" fill="none" opacity="0.4" />
                  </svg>
                </div>
                
                {/* Merchant Pins */}
                <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                  <span className="material-symbols-outlined text-white text-xl">storefront</span>
                </div>
                <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-accent-dark rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                  <span className="material-symbols-outlined text-white text-xl">storefront</span>
                </div>
                <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                  <span className="material-symbols-outlined text-white text-xl">storefront</span>
                </div>
                
                {/* User Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-14 h-14 bg-white dark:bg-dark-surface rounded-full flex items-center justify-center shadow-xl border-4 border-primary">
                    <span className="material-symbols-outlined text-primary text-2xl">person</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rotate-45"></div>
                </div>

                {/* Distance indicators */}
                <div className="absolute top-1/3 left-1/2 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <span className="text-xs font-bold text-primary">0.3 km</span>
                </div>
                <div className="absolute bottom-1/2 right-1/3 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <span className="text-xs font-bold text-accent-dark">0.5 km</span>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute bottom-8 left-4 right-4 bg-white dark:bg-dark-surface-elevated rounded-2xl shadow-xl p-4 border border-border-light dark:border-dark-border transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-light dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary dark:text-accent">storefront</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-primary dark:text-dark-text-primary truncate">Farmacia Guadalupe</p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">0.3 km · 5 min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted dark:text-dark-text-muted">Recibes</p>
                    <p className="font-bold text-accent-dark">$4,950 MXN</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useI18n } from '../i18n'

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                <span className="text-sm font-medium text-primary">{t.hero.merchants}</span>
              </div>
              <a
                href="https://github.com/Micopay/micopay-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full hover:border-accent-dark hover:bg-primary-light transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-text-primary">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium text-text-primary">Open Source</span>
              </a>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-text-primary mb-6 leading-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary-light transition-colors"
              >
                {t.nav.howItWorks}
                <span className="material-symbols-outlined">arrow_downward</span>
              </a>
            </div>
          </div>

          {/* Visual - Map Preview */}
          <div className="relative">
            <div className="relative bg-surface rounded-3xl shadow-2xl p-6 border border-border-light overflow-hidden transition-colors duration-300">
              {/* Map Background */}
              <div className="aspect-square rounded-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #1a3a2a 0%, #0d2818 50%, #1a3a2a 100%)'}}>
                {/* Decorative map elements */}
                <div className="absolute inset-0 opacity-40" aria-hidden="true">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#5DCAA5" strokeWidth="0.5" opacity="0.2" />
                    <line x1="0" y1="200" x2="400" y2="200" stroke="#5DCAA5" strokeWidth="0.5" opacity="0.2" />
                    <line x1="0" y1="300" x2="400" y2="300" stroke="#5DCAA5" strokeWidth="0.5" opacity="0.2" />
                    <line x1="100" y1="0" x2="100" y2="400" stroke="#5DCAA5" strokeWidth="0.5" opacity="0.2" />
                    <line x1="200" y1="0" x2="200" y2="400" stroke="#5DCAA5" strokeWidth="0.5" opacity="0.2" />
                    <line x1="300" y1="0" x2="300" y2="400" stroke="#5DCAA5" strokeWidth="0.5" opacity="0.2" />
                    <path d="M50,200 Q200,180 350,200" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity="0.3" />
                    <path d="M200,50 Q180,200 200,350" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity="0.3" />
                    <path d="M100,100 Q150,150 200,120" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity="0.2" />
                    <path d="M250,250 Q300,280 350,300" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity="0.2" />
                  </svg>
                </div>
                
                {/* Merchant Pins */}
                <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
                  <span className="material-symbols-outlined text-[#0B1420] text-xl">storefront</span>
                </div>
                <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-accent-dark rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
                  <span className="material-symbols-outlined text-white text-xl">storefront</span>
                </div>
                <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
                  <span className="material-symbols-outlined text-[#0B1420] text-xl">storefront</span>
                </div>
                
                {/* User Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                  <div className="w-14 h-14 bg-[#111C28] rounded-full flex items-center justify-center shadow-xl border-4 border-accent">
                    <span className="material-symbols-outlined text-accent text-2xl">person</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rotate-45"></div>
                </div>

                {/* Distance indicators */}
                <div className="absolute top-1/3 left-1/2 bg-[#111C28]/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-[#5DCAA5]/30" aria-hidden="true">
                  <span className="text-xs font-bold text-accent">0.3 km</span>
                </div>
                <div className="absolute bottom-1/2 right-1/3 bg-[#111C28]/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-[#5DCAA5]/30" aria-hidden="true">
                  <span className="text-xs font-bold text-accent">0.5 km</span>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute bottom-8 left-4 right-4 bg-[#111C28] rounded-2xl shadow-xl p-4 border border-[#5DCAA5]/20 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent">storefront</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">Farmacia Guadalupe</p>
                    <p className="text-sm text-[#8FA3AD]">0.3 km · 5 min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#8FA3AD]">Recibes</p>
                    <p className="font-bold text-accent">$4,950 MXN</p>
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

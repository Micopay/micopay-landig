import { useI18n } from '../i18n'

const icons = ['shield_lock', 'account_balance', 'verified_user']

export default function TrustSecurity() {
  const { t } = useI18n()

  return (
    <section id="seguridad" className="section-padding bg-gradient-to-b from-white to-primary-light/30 transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-primary mb-4">
            {t.trust.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t.trust.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.trust.features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative bg-surface rounded-3xl p-8 shadow-lg shadow-primary/5 border border-border-light transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {icons[index]}
                </span>
              </div>

              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-surface rounded-3xl p-8 md:p-12 shadow-xl border border-border-light transition-colors duration-300">
          <div className="grid md:grid-cols-5 items-center gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary text-2xl">person</span>
              </div>
              <p className="font-bold text-text-primary">Usuario</p>
              <p className="text-sm text-text-secondary">Envía USDC</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">arrow_forward</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-dark rounded-full flex items-center justify-center mb-3 shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">lock</span>
              </div>
              <p className="font-bold text-primary">Escrow</p>
              <p className="text-sm text-text-secondary">Smart Contract</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">arrow_forward</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-accent-dark text-2xl">storefront</span>
              </div>
              <p className="font-bold text-text-primary">Proveedor</p>
              <p className="text-sm text-text-secondary">Entrega efectivo</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary italic max-w-xl mx-auto">
              "El proveedor solo recibe USDC después de confirmar que recibiste tu efectivo"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

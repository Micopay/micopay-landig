import { useI18n } from '../i18n'

const icons = ['search', 'compare_arrows', 'qr_code_scanner']

export default function HowItWorks() {
  const { t } = useI18n()

  return (
    <section id="como-funciona" className="section-padding bg-white dark:bg-dark-background transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-primary dark:text-dark-text-primary mb-4">
            {t.howItWorks.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {t.howItWorks.steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < t.howItWorks.steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10"></div>
              )}
              
              <div className="relative bg-surface dark:bg-dark-surface rounded-3xl p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary dark:bg-accent-dark text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {step.number}
                </div>
                
                <div className="w-20 h-20 bg-primary-light dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-4xl">
                    {icons[index]}
                  </span>
                </div>
                
                <h3 className="text-xl font-heading font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

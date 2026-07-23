import { useState } from 'react'
import { useI18n } from '../i18n'

export default function FAQ() {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="section-padding bg-white transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-primary mb-4">
            {t.faq.title}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {t.faq.questions.map((item, index) => (
            <div
              key={index}
              className="border-b border-border-light last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className="font-heading font-bold text-text-primary group-hover:text-primary transition-colors pr-4">
                  {item.q}
                </span>
                <span className={`material-symbols-outlined text-text-muted transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  expand_more
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-text-secondary leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

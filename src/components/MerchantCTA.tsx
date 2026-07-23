import { useState } from 'react'
import { useI18n } from '../i18n'

export default function MerchantCTA() {
  const { t } = useI18n()
  const [transactions, setTransactions] = useState(100)
  const averagePerTx = 500

  const earnings = transactions * averagePerTx * 0.02

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-primary mb-4">
              {t.merchantCTA.title}
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              {t.merchantCTA.subtitle}
            </p>

            <ul className="space-y-4 mb-8">
              {t.merchantCTA.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                  </span>
                  <span className="text-text-secondary">{benefit}</span>
                </li>
              ))}
            </ul>

            <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              {t.merchantCTA.cta}
            </button>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-border-light">
            <h3 className="text-xl font-heading font-bold text-text-primary mb-6">
              {t.merchantCTA.calculator.title}
            </h3>

            <div className="space-y-6">
              {/* Transactions slider */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t.merchantCTA.calculator.label}
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={transactions}
                  onChange={(e) => setTransactions(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-text-muted">10</span>
                  <span className="text-lg font-bold text-primary">{transactions}</span>
                  <span className="text-sm text-text-muted">500</span>
                </div>
              </div>

              {/* Average */}
              <div className="flex items-center justify-between py-4 border-y border-border-light">
                <span className="text-text-secondary">{t.merchantCTA.calculator.average}</span>
                <span className="font-bold text-text-primary">${averagePerTx} MXN</span>
              </div>

              {/* Result */}
              <div className="bg-primary-light rounded-2xl p-6 text-center">
                <p className="text-sm text-text-secondary mb-2">{t.merchantCTA.calculator.result}</p>
                <p className="text-4xl font-heading font-extrabold text-primary">
                  ${earnings.toLocaleString()} MXN
                </p>
                <p className="text-sm text-text-muted mt-2">/mes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useI18n } from '../i18n'

const mockMerchants = [
  { id: '1', name: 'Farmacia Guadalupe', distance: '0.3 km', walkMin: 5, rate: 2.1, completion: 98, trades: 312, tier: 'Maestro', isBusiness: true },
  { id: '2', name: 'Tienda Don Pepe', distance: '0.5 km', walkMin: 8, rate: 2.3, completion: 95, trades: 187, tier: 'Avanzado', isBusiness: true },
  { id: '3', name: 'Café El Parque', distance: '0.8 km', walkMin: 12, rate: 2.5, completion: 92, trades: 89, tier: 'Inicial', isBusiness: false },
  { id: '4', name: 'OXXO Roma Norte', distance: '1.2 km', walkMin: 15, rate: 2.0, completion: 99, trades: 1024, tier: 'Maestro', isBusiness: true },
]

const tierColors: Record<string, string> = {
  'Maestro': 'bg-primary text-white',
  'Avanzado': 'bg-accent-dark text-white',
  'Inicial': 'bg-surface-container-high text-text-secondary',
}

export default function FeaturedMerchants() {
  const { t } = useI18n()
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { key: 'all', label: t.merchants.filters.all },
    { key: 'nearby', label: t.merchants.filters.nearby },
    { key: 'bestRate', label: t.merchants.filters.bestRate },
    { key: 'topRated', label: t.merchants.filters.topRated },
  ]

  const filteredMerchants = [...mockMerchants].sort((a, b) => {
    if (activeFilter === 'nearby') return parseFloat(a.distance) - parseFloat(b.distance)
    if (activeFilter === 'bestRate') return a.rate - b.rate
    if (activeFilter === 'topRated') return b.completion - a.completion
    return 0
  })

  return (
    <section id="proveedores" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-primary mb-4">
            {t.merchants.title}
          </h2>
          <p className="text-lg text-text-secondary">
            {t.merchants.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter.key
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface text-text-secondary hover:bg-surface-container border border-border'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMerchants.map(merchant => (
            <div
              key={merchant.id}
              className="bg-surface rounded-3xl p-6 border border-border-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    {merchant.isBusiness ? 'storefront' : 'person'}
                  </span>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${tierColors[merchant.tier]}`}>
                  {merchant.tier}
                </span>
              </div>

              <h3 className="font-heading font-bold text-text-primary mb-2 truncate">
                {merchant.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>{merchant.distance} · {merchant.walkMin} {t.merchants.card.min}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-border-light">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t.merchants.card.rate}</p>
                  <p className="font-bold text-text-primary">{merchant.rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t.merchants.card.completion}</p>
                  <p className="font-bold text-text-primary">{merchant.completion}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-secondary">
                  {merchant.trades} ops
                </span>
                {merchant.rate <= 2.1 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent-dark text-xs font-bold rounded-lg">
                    <span className="material-symbols-outlined text-sm">star</span>
                    {t.merchants.bestRate}
                  </span>
                )}
              </div>

              <button className="w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">
                {t.merchants.card.viewOffer}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

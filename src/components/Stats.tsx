import { useI18n } from '../i18n'

const stats = [
  { value: '500+', key: 'merchants' },
  { value: '10K+', key: 'transactions' },
  { value: '12', key: 'cities' },
  { value: '50K+', key: 'users' },
]

export default function Stats() {
  const { t } = useI18n()

  return (
    <section className="py-16 bg-primary">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white text-center mb-12">
          {t.stats.title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.key} className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-white/80 font-medium">
                {t.stats[stat.key as keyof typeof t.stats]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

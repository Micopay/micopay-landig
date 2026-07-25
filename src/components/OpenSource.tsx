import { useI18n } from '../i18n'

const technologies = [
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Stellar', icon: '★' },
  { name: 'Soroban', icon: '◆' },
  { name: 'Node.js', icon: '⬢' },
  { name: 'PostgreSQL', icon: '🐘' },
]

export default function OpenSource() {
  const { t } = useI18n()

  return (
    <section className="py-12 border-y border-border-light bg-surface-container-low/50 transition-colors duration-300">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <p className="text-sm font-medium text-text-secondary whitespace-nowrap">
            {t.openSource.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {technologies.map(tech => (
              <div
                key={tech.name}
                className="flex items-center gap-2 text-text-primary hover:text-accent-dark transition-colors"
              >
                <span className="text-lg">{tech.icon}</span>
                <span className="text-sm font-semibold">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { I18nProvider } from './i18n'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import FeaturedMerchants from './components/FeaturedMerchants'
import TrustSecurity from './components/TrustSecurity'
import Stats from './components/Stats'
import MerchantCTA from './components/MerchantCTA'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Hero />
            <HowItWorks />
            <FeaturedMerchants />
            <TrustSecurity />
            <Stats />
            <MerchantCTA />
            <FAQ />
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App

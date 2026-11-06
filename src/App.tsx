import { About } from './components/About/About'
import { Contact } from './components/Contact/Contact'
import { Credibility } from './components/Credibility/Credibility'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Process } from './components/Process/Process'
import { Services } from './components/Services/Services'
import { Work } from './components/Work/Work'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Work />
        <Credibility />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

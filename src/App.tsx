import { useRef } from 'react'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { ContactDock } from './components/ContactDock/ContactDock'
import { Hero } from './sections/Hero/Hero'
import { useHeroMotion } from './sections/Hero/useHeroMotion'
import { Capabilities } from './sections/Capabilities/Capabilities'
import { Work } from './sections/Work/Work'
import { Experience } from './sections/Experience/Experience'
import { Contact } from './sections/Contact/Contact'
import { useInitialAnchor } from './hooks/useInitialAnchor'

function App() {
  const scope = useRef<HTMLDivElement>(null)
  useHeroMotion(scope)
  useInitialAnchor()
  return (
    <div ref={scope}>
      <Header />
      <main>
        <Hero />
        <Capabilities />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ContactDock />
    </div>
  )
}

export default App

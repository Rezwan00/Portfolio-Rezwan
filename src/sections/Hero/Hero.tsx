import { LinkButton } from '../../components/Button/Button'
import { HeroPortrait } from './HeroPortrait'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero theme-dark" id="top" aria-labelledby="hero-title">
      <div className="container container--wide hero__content">
        <p className="hero__intro label" data-hero-intro>Hi, I&apos;m</p>

        <div className="hero__word">
          <div className="hero__word-scroll">
            <div className="hero__word-pointer">
              <div className="hero__word-mask">
                <h1 className="hero__word-reveal" id="hero-title" data-hero-word>
                  REZWAN<span className="sr-only"> Qaderi</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Layout → scroll → pointer → entrance: each owns its transform. */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__visual-scroll">
            <div className="hero__visual-pointer">
              <div className="hero__visual-reveal" data-hero-visual>
                <HeroPortrait />
              </div>
            </div>
          </div>
        </div>

        <div className="hero__meta">
          <p className="hero__role" data-hero-role>
            <span>Software Engineer</span>
            <span>&amp; Creative Developer</span>
          </p>
          <p className="hero__statement" data-hero-statement>
            I design and build digital experiences where engineering, design and product meet.
          </p>
        </div>

        <div className="hero__aside">
          <p className="hero__disciplines label" data-hero-disciplines>
            <span>Engineering × Design</span>
            <span>× Product × Web</span>
          </p>
          <div className="hero__cta" data-hero-cta>
            <LinkButton href="#contact" size="large" iconEnd="↗" className="hero__cta-link">
              LET&apos;S TALK
            </LinkButton>
          </div>
        </div>

        <div className="hero__bottom">
          <p className="hero__location label" data-hero-location>Helsinki, Finland</p>
          {/* A visual cue only: there is no next section to navigate to yet. */}
          <p className="hero__scroll" data-hero-scroll aria-hidden="true">
            <span className="label">Scroll</span><span className="hero__scroll-arrow">↓</span>
          </p>
        </div>
      </div>
    </section>
  )
}

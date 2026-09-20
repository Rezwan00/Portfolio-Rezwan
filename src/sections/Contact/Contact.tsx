import { useRef } from 'react'
import { LinkButton } from '../../components/Button/Button'
import { useContactMotion } from './useContactMotion'
import './Contact.css'

const EMAIL = 'ahmadrezwanqaderi@gmail.com'

export function Contact() {
  const scope = useRef<HTMLElement>(null)
  useContactMotion(scope)

  return (
    <section ref={scope} className="contact theme-dark" id="contact" aria-labelledby="contact-title">
      <svg className="contact__ring" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="188" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container container--wide">
        <div className="contact__intro">
          <p className="contact__eyebrow label" data-contact-intro>08 / Contact</p>

          <h2 className="contact__title" id="contact-title">
            <span className="contact__title-row">
              <span className="contact__title-mask"><span data-contact-word>LET&apos;S</span></span>
              <span className="contact__title-mask"><span data-contact-word>BUILD</span></span>
            </span>
            <span className="contact__title-mask"><span data-contact-word>SOMETHING.</span></span>
          </h2>

          <div className="contact__body">
            <p className="contact__statement" data-contact-copy>
              Have a project, freelance opportunity or an interesting idea?
            </p>
            <p className="contact__statement" data-contact-copy>
              I&apos;m always open to hearing about what you&apos;re building.
            </p>
            <div className="contact__cta" data-contact-cta>
              <LinkButton href={`mailto:${EMAIL}`} size="large" iconEnd="↗" className="contact__cta-link">
                START A CONVERSATION
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

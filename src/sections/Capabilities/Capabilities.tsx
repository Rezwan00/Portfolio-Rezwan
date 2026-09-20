import { useRef } from 'react'
import { useCapabilitiesMotion } from './useCapabilitiesMotion'
import './Capabilities.css'

const disciplines = [
  ['Engineering', 'Frontend engineering · Implementation'],
  ['Creative development', 'Interactive interfaces · Visual implementation'],
  ['Web & WordPress', 'Web platforms · Performance · SEO'],
  ['Digital experience', 'Product experiences · Accessibility'],
] as const

export function Capabilities() {
  const scope = useRef<HTMLElement>(null)
  useCapabilitiesMotion(scope)

  return (
    <section ref={scope} className="capabilities theme-light" id="about" aria-labelledby="capabilities-title">
      <div className="capabilities__surface" aria-hidden="true" />
      <div className="container container--wide capabilities__content">
        <p className="capabilities__eyebrow label" data-capabilities-intro>
          <span>01 / What I do</span>
          <span className="capabilities__direction" aria-hidden="true">↙</span>
        </p>

        <h2 className="capabilities__title" id="capabilities-title">
          <span className="capabilities__lead" data-capabilities-intro>I work<br />across</span>
          <span className="capabilities__line capabilities__line--engineering">
            <span data-capabilities-word>Engineering</span>
          </span>
          <span className="capabilities__line capabilities__line--design">
            <span data-capabilities-word><span className="capabilities__cross">×</span> Design</span>
          </span>
          <span className="capabilities__line capabilities__line--web">
            <span data-capabilities-word><span className="capabilities__cross">×</span> Web</span>
          </span>
        </h2>

        <div className="capabilities__summary">
          <p className="capabilities__statement" data-capabilities-copy>
            I build digital experiences from interface and interaction through implementation,
            performance and the web.
          </p>
        </div>

        <dl className="capabilities__disciplines">
          {disciplines.map(([name, detail], index) => (
            <div className="capabilities__discipline" key={name} data-capabilities-discipline>
              <dt>
                <span className="capabilities__number label" aria-hidden="true">0{index + 1}</span>
                <span>{name}</span>
              </dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

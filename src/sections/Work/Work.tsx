import { useRef } from 'react'
import { RayleighShowcase } from './RayleighShowcase'
import { LightningChartShowcase } from './LightningChartShowcase'
import { SelectedWeb } from './SelectedWeb'
import { useWorkMotion } from './useWorkMotion'
import './Work.css'

export function Work() {
  const scope = useRef<HTMLElement>(null)
  useWorkMotion(scope)

  return (
    <section ref={scope} className="work theme-dark" id="work" aria-labelledby="work-title">
      <div className="container container--wide">
        <div className="work__intro">
          <p className="work__eyebrow label" data-work-intro>02 / Selected work</p>
          <h2 className="work__title" id="work-title">
            <span className="work__title-mask"><span data-work-word>Selected</span></span>
            <span className="work__title-mask work__title-mask--offset"><span data-work-word>Work</span></span>
          </h2>
          <p className="work__statement" data-work-copy>A selection of digital products, interfaces and web experiences I&apos;ve helped design and build.</p>
        </div>
        <RayleighShowcase />
        <LightningChartShowcase />
        <SelectedWeb />
      </div>
    </section>
  )
}

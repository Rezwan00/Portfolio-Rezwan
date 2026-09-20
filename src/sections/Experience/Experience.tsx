import { useRef } from 'react'
import { experience } from '../../data/experience'
import { useExperienceMotion } from './useExperienceMotion'
import './Experience.css'

export function Experience() {
  const scope = useRef<HTMLElement>(null)
  useExperienceMotion(scope)

  return (
    <section ref={scope} className="experience theme-dark" id="experience" aria-labelledby="experience-title">
      <div className="container container--wide">
        <header className="experience__intro">
          <p className="experience__eyebrow label" data-experience-intro>07 / Experience</p>
          <h2 className="experience__title" id="experience-title" data-experience-intro>Experience</h2>
          <p className="experience__statement" data-experience-intro>
            Selected roles across software engineering, frontend development and digital experiences.
          </p>
        </header>
        <ol className="experience__list" role="list">
          {experience.map(entry => (
            <li className="experience__item" key={entry.id} data-experience-row>
              <article className="experience__row" aria-labelledby={`experience-${entry.id}`}>
                <span className="experience__index label" aria-hidden="true">{entry.number}</span>
                <div className="experience__identity">
                  <h3 className="experience__company" id={`experience-${entry.id}`}>{entry.company}</h3>
                  <p className="experience__role">{entry.role}</p>
                  {entry.period && <p className="experience__period label">{entry.period}</p>}
                </div>
                <ul className="experience__disciplines label" aria-label="Disciplines and technologies" role="list">
                  {entry.disciplines.map(discipline => <li key={discipline}>{discipline}</li>)}
                </ul>
                <p className="experience__description">{entry.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

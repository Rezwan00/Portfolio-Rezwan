import { selectedWebIdentity, selectedWebProjects } from '../../data/projects'
import { ProjectHeading } from './ProjectShowcase'
import { ProjectMedia } from './ProjectMedia'

export function SelectedWeb() {
  return (
    <article className="showcase showcase--web" aria-labelledby="selected-web-title">
      <ProjectHeading project={selectedWebIdentity} />
      <div className="web-gallery">
        {selectedWebProjects.map((project, index) => (
          <article className={`web-entry web-entry--${project.id}`} aria-labelledby={`${project.id}-title`} key={project.id}>
            <div className="web-entry__info" data-work-reveal>
              <h4 className="web-entry__title" id={`${project.id}-title`}>{project.title}</h4>
              <dl className="web-entry__metadata">
                <div><dt className="sr-only">Industry</dt><dd>{project.industry}</dd></div>
                <div><dt className="sr-only">Contribution</dt><dd>{project.contribution}</dd></div>
                <div><dt className="sr-only">Technology</dt><dd>{project.technology}</dd></div>
              </dl>
            </div>
            <ProjectMedia className={`web-entry__image ${project.id === 'xorbix' ? 'project-visual--hero-crop' : ''}`} media={project.image}
              sizes={project.id === 'sorrento'
                ? '(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 92vw, (max-width: 1920px) 85vw, 1555px'
                : project.id === 'alexis'
                  ? '(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 77vw, (max-width: 1920px) 54vw, 980px'
                  : '(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 84vw, (max-width: 1920px) 62vw, 1130px'}
              depth={[10, -8, 12][index]} />
          </article>
        ))}
      </div>
    </article>
  )
}

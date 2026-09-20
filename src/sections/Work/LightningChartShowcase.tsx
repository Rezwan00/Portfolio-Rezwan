import { lightningProject as project } from '../../data/projects'
import { ProjectHeading, ProjectInfo } from './ProjectShowcase'
import { ProjectMedia } from './ProjectMedia'

export function LightningChartShowcase() {
  return (
    <article className="showcase showcase--lightning" aria-labelledby={`${project.id}-title`}>
      <ProjectHeading project={project} />
      <ProjectMedia className="technical__website" media={project.website} caption="LightningChart / Data visualization products"
        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 84vw, (max-width: 1920px) 62vw, 1130px" depth={12} />
      <ProjectInfo role={project.role} disciplines={project.disciplines} />
      <ProjectMedia className="technical__platform" media={project.platform} caption="Dashtera / Dashboard platform"
        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 84vw, (max-width: 1920px) 62vw, 1130px" depth={-8} />
    </article>
  )
}

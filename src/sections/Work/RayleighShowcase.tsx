import { rayleighProject as project } from '../../data/projects'
import { ProjectHeading, ProjectInfo } from './ProjectShowcase'
import { ProjectMedia } from './ProjectMedia'

export function RayleighShowcase() {
  return (
    <article className="showcase showcase--rayleigh" aria-labelledby={`${project.id}-title`}>
      <ProjectHeading project={project} />
      <ProjectInfo role={project.role} disciplines={project.disciplines} />
      <div className="ecosystem">
        <ProjectMedia className="ecosystem__website" media={project.website} caption="MVTRX / Interactive web"
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 92vw, (max-width: 1920px) 70vw, 1270px" priority depth={8} />
        <ProjectMedia className="ecosystem__exchange" media={project.exchange} caption="MVTRX / Product interface"
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 78vw, (max-width: 1920px) 46vw, 840px" depth={18} />
        <ProjectMedia className="ecosystem__origin" media={project.origin} caption="Rayleigh Research / Ecosystem origin"
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 74vw, (max-width: 1920px) 38vw, 700px" depth={10} />
      </div>
    </article>
  )
}

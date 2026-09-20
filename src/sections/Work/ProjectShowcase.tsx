import type { ShowcaseIdentity } from '../../data/projects'

export function ProjectHeading({ project }: { project: ShowcaseIdentity }) {
  return (
    <header className="showcase__heading" data-work-reveal>
      <p className="showcase__index label">{project.number} / {project.category}</p>
      <h3 className="showcase__title" id={`${project.id}-title`} aria-label={project.title}>
        {project.titleLines.map(line => <span className="project__title-mask" key={line}><span data-project-title>{line}</span></span>)}
      </h3>
      <p className="showcase__subtitle">{project.subtitle}</p>
    </header>
  )
}

export function ProjectInfo({ role, disciplines }: { role: string; disciplines: readonly string[] }) {
  return (
    <dl className="showcase__info" data-work-reveal>
      <div><dt className="label">Role</dt><dd>{role}</dd></div>
      <div><dt className="label">Disciplines</dt><dd>{disciplines.join(' / ')}</dd></div>
    </dl>
  )
}

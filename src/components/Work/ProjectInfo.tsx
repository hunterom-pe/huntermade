import type { Project } from '../../data/projects'

type ProjectInfoProps = {
  project: Project
  /** Visual tone of the panel the info sits on */
  tone?: 'light' | 'dark'
}

/** Number, category, name, description, details and links for a project. */
export function ProjectInfo({ project, tone = 'light' }: ProjectInfoProps) {
  const titleId = `project-${project.id}`
  return (
    <div className={`project-info project-info--${tone}`}>
      <p className="project-info__meta label">
        <span className="project-info__num">{project.number}</span>
        <span aria-hidden="true">/</span>
        <span>{project.category}</span>
      </p>
      <h3 id={titleId} className="project-info__name">
        {project.name}
      </h3>
      <p className="project-info__desc">{project.description}</p>
      {project.details && (
        <ul className="project-info__details label" aria-label={`${project.name} highlights`}>
          {project.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      <div className="project-info__links">
        <a
          className="btn project-info__primary"
          href={project.primary.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {project.primary.label}
          <span className="btn__arrow" aria-hidden="true">
            ↗
          </span>
          <span className="visually-hidden"> for {project.name} (opens in a new tab)</span>
        </a>
        {project.github && (
          <a className="project-info__code" href={project.github} target="_blank" rel="noopener noreferrer">
            View code<span className="visually-hidden"> for {project.name} on GitHub (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  )
}

import type { ProjectMedia as ProjectMediaData } from '../../data/projects'

type ProjectMediaProps = {
  media: ProjectMediaData
  caption?: string
  className?: string
  sizes: string
  priority?: boolean
  depth?: number
}

export function ProjectMedia({ media, caption, className = '', sizes, priority = false, depth = 10 }: ProjectMediaProps) {
  return (
    <div className={`project-visual ${className}`} data-work-visual data-depth={depth}>
      <div className="project__catalog-depth">
        <figure className="project__media-depth">
          <div className={`project__media project__media--${media.type}`}>
            <div className="project__media-reveal">
              {media.type === 'image' ? (
                <img src={media.src} srcSet={media.srcSet} sizes={sizes} alt={media.alt}
                  width={media.width} height={media.height} loading={priority ? 'eager' : 'lazy'}
                  fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
              ) : (
                <video src={media.src} poster={media.poster} aria-label={media.label} controls playsInline preload="none">
                  {media.captions && <track kind="captions" src={media.captions.src} srcLang={media.captions.language} label={media.captions.label} default />}
                  Your browser does not support video playback.
                </video>
              )}
            </div>
            <div className="project__media-curtain" aria-hidden="true" />
          </div>
          {caption && <figcaption className="project-visual__caption label">{caption}</figcaption>}
        </figure>
      </div>
    </div>
  )
}

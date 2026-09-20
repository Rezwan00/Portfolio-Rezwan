import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './SectionHeading.css'

export type SectionHeadingProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center' | 'right'
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'default' | 'large' | 'xl'
  titleId?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  level = 2,
  size = 'default',
  titleId,
  className = '',
  ...props
}: SectionHeadingProps) {
  const Heading = `h${level}` as const

  return (
    <div className={`section-heading section-heading--${align} section-heading--${size} ${className}`} {...props}>
      {eyebrow && <p className="label text-muted">{eyebrow}</p>}
      <Heading id={titleId} className="section-heading__title">{title}</Heading>
      {description && <p className="section-heading__description body-lg text-muted">{description}</p>}
    </div>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import './VisualPlaceholder.css'

export type VisualPlaceholderProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  label: string
  aspectRatio?: CSSProperties['aspectRatio']
  theme?: 'dark' | 'light'
}

export function VisualPlaceholder({
  label, aspectRatio = '4 / 3', theme, className = '', style, ...props
}: VisualPlaceholderProps) {
  return (
    <div
      className={`visual-placeholder ${theme ? `theme-${theme}` : ''} ${className}`}
      style={{ aspectRatio, ...style }}
      {...props}
    >
      <span className="visual-placeholder__meta label">Visual placeholder</span>
      <span className="visual-placeholder__label label">{label}</span>
    </div>
  )
}

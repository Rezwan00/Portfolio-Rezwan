import type { ComponentPropsWithoutRef } from 'react'
import './RQBrand.css'

export type RQBrandProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  size?: 'small' | 'medium' | 'large'
  /** Theme names describe the surrounding surface, not the glyph color. */
  theme?: 'dark' | 'light'
}

export function RQBrand({ size = 'medium', theme, className = '', ...props }: RQBrandProps) {
  return (
    <span className={`rq-brand rq-brand--${size} ${theme ? `theme-${theme}` : ''} ${className}`} {...props}>
      RQ
    </span>
  )
}

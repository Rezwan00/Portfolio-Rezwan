import type { ComponentPropsWithoutRef } from 'react'
import './Section.css'

export type SectionProps = ComponentPropsWithoutRef<'section'> & {
  theme?: 'dark' | 'light'
  spacing?: 'default' | 'compact' | 'none'
  overflow?: 'visible' | 'hidden' | 'clip'
}

export function Section({
  theme = 'dark',
  spacing = 'default',
  overflow = 'visible',
  className = '',
  ...props
}: SectionProps) {
  return (
    <section
      className={`section theme-${theme} section--${spacing} section--overflow-${overflow} ${className}`}
      {...props}
    />
  )
}

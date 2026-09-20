import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import './MediaFrame.css'

export type MediaFrameProps = ComponentPropsWithoutRef<'div'> & {
  aspectRatio?: CSSProperties['aspectRatio']
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fit?: 'cover' | 'contain'
}

export function MediaFrame({
  aspectRatio = '16 / 9', radius = 'lg', fit = 'cover',
  className = '', style, ...props
}: MediaFrameProps) {
  const frameStyle = {
    '--media-aspect-ratio': aspectRatio,
    '--media-radius': radius === 'none' ? '0px' : `var(--radius-${radius})`,
    '--media-fit': fit,
    ...style,
  } as CSSProperties

  return <div className={`media-frame ${className}`} style={frameStyle} {...props} />
}

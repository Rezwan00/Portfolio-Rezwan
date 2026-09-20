import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './Button.css'

type ButtonStyleProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'small' | 'medium' | 'large'
  children: ReactNode
  iconStart?: ReactNode
  iconEnd?: ReactNode
}

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonStyleProps
export type LinkButtonProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & ButtonStyleProps & {
  href: string
  disabled?: boolean
}

function ButtonContent({ children, iconStart, iconEnd }: Pick<ButtonStyleProps, 'children' | 'iconStart' | 'iconEnd'>) {
  return (
    <>
      {iconStart && <span className="button__icon" aria-hidden="true">{iconStart}</span>}
      <span className="button__label">{children}</span>
      {iconEnd && <span className="button__icon" aria-hidden="true">{iconEnd}</span>}
    </>
  )
}

export function Button({
  variant = 'primary', size = 'medium', type = 'button',
  iconStart, iconEnd, children, className = '', ...props
}: ButtonProps) {
  return (
    <button type={type} className={`button button--${variant} button--${size} ${className}`} {...props}>
      <ButtonContent iconStart={iconStart} iconEnd={iconEnd}>{children}</ButtonContent>
    </button>
  )
}

export function LinkButton({
  variant = 'primary', size = 'medium', disabled = false,
  iconStart, iconEnd, children, className = '',
  href, target, rel, onClick, tabIndex, ...props
}: LinkButtonProps) {
  const safeRel = target === '_blank'
    ? [...new Set([...(rel?.split(/\s+/) ?? []), 'noopener', 'noreferrer'])].join(' ')
    : rel

  return (
    <a
      {...props}
      className={`button button--${variant} button--${size} ${className}`}
      href={disabled ? undefined : href}
      target={target}
      rel={safeRel}
      role={disabled ? 'link' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
    >
      <ButtonContent iconStart={iconStart} iconEnd={iconEnd}>{children}</ButtonContent>
    </a>
  )
}

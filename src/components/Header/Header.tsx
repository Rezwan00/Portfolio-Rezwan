import { useRef } from 'react'
import { RQBrand } from '../RQBrand/RQBrand'
import { useHeaderTheme } from './useHeaderTheme'
import './Header.css'

const navigation = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
] as const

export function Header() {
  const scope = useRef<HTMLElement>(null)
  useHeaderTheme(scope)
  return (
    <header ref={scope} className="site-header" data-hero-header data-surface="dark">
      <div className="container container--wide site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="Rezwan Qaderi — home">
          <RQBrand size="small" />
        </a>
        <nav className="site-header__nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a className="site-header__link label" href={href} key={href}>{label}</a>
          ))}
        </nav>
        {/* Focusable but explicitly unavailable until the menu is implemented.
            Do not claim aria-expanded/controls for a menu that does not exist. */}
        <div className="site-header__mobile">
          <button
            className="site-header__menu label"
            type="button"
            aria-disabled="true"
            aria-describedby="menu-availability"
          >
            Menu
          </button>
          <span id="menu-availability" className="sr-only">
            Menu navigation will be available when the remaining sections are added.
          </span>
        </div>
      </div>
    </header>
  )
}

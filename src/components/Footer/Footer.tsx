import type { MouseEvent } from 'react'
import { RQBrand } from '../RQBrand/RQBrand'
import './Footer.css'

const year = new Date().getFullYear()

export function Footer() {
  const handleBackToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('top')
    if (!target) return
    event.preventDefault()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <footer className="site-footer theme-dark">
      <div className="container container--wide site-footer__inner">
        <div className="site-footer__identity">
          <RQBrand size="small" />
          <div>
            <p className="site-footer__name">Rezwan Qaderi</p>
            <p className="site-footer__location label">Helsinki, Finland</p>
          </div>
        </div>

        <a className="site-footer__top label" href="#top" onClick={handleBackToTop}>
          Back to top <span aria-hidden="true">↑</span>
        </a>

        <p className="site-footer__copyright label">© {year} Rezwan Qaderi</p>
      </div>
    </footer>
  )
}

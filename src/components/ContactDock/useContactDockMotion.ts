import { useLayoutEffect, type RefObject } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'

/** A persistent utility, not a section: it reveals once after the Hero's own
    entrance settles, then only reacts to the page by stepping aside near
    Contact, where the same three destinations already have a home. */
export function useContactDockMotion(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    const dock = scope.current
    if (!dock) return
    const media = gsap.matchMedia()

    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      // Desktop centers the dock with a CSS translateY(-50%); animating GSAP's
      // own x/y would silently overwrite that inline. `right` sidesteps it
      // entirely and still reads as the same small inward slide.
      const entrance = gsap.from(dock, {
        opacity: 0, right: '+=10', duration: 0.6, delay: 2.2, ease: 'power2.out',
        clearProps: 'opacity,right',
      })
      const showForFocus = () => { entrance.progress(1) }
      dock.addEventListener('focusin', showForFocus)
      return () => dock.removeEventListener('focusin', showForFocus)
    }, dock)

    return () => media.revert()
  }, { scope })

  useLayoutEffect(() => {
    const dock = scope.current
    const contact = document.getElementById('contact')
    const hero = document.getElementById('top')
    if (!dock || !contact) return
    const mobile = window.matchMedia('(max-width: 767px)')
    const contactBounds = contact.getBoundingClientRect()
    let atContact = Math.max(0, Math.min(innerHeight, contactBounds.bottom) - Math.max(0, contactBounds.top)) / contactBounds.height >= 0.15
    // A small clearance below Hero avoids the dock arriving beside its last
    // CTA/location pixels. The initial layout check also covers anchor refresh.
    let atHero = !!hero && hero.getBoundingClientRect().bottom > -80 && hero.getBoundingClientRect().top < innerHeight
    const update = () => {
      const hidden = atContact || (mobile.matches && atHero)
      dock.setAttribute('data-hidden', String(hidden))
      dock.toggleAttribute('inert', hidden)
    }
    const contactObserver = new IntersectionObserver(([entry]) => {
      atContact = !!entry?.isIntersecting && entry.intersectionRatio >= 0.15
      update()
    }, { threshold: [0, 0.15] })
    const heroObserver = new IntersectionObserver(([entry]) => {
      atHero = entry?.isIntersecting ?? false
      update()
    }, { threshold: 0, rootMargin: '80px 0px 0px' })
    contactObserver.observe(contact)
    if (hero) heroObserver.observe(hero)
    mobile.addEventListener('change', update)
    update()
    return () => {
      contactObserver.disconnect(); heroObserver.disconnect()
      mobile.removeEventListener('change', update)
    }
  }, [scope])
}

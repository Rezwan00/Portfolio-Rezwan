import { useEffect, type RefObject } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'

/** A persistent utility, not a section: it reveals once after the Hero's own
    entrance settles, then only reacts to the page by stepping aside near
    Contact, where the same three destinations already have a home. */
export function useContactDockMotion(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    const dock = scope.current
    if (!dock) return
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      // Desktop centers the dock with a CSS translateY(-50%); animating GSAP's
      // own x/y would silently overwrite that inline. `right` sidesteps it
      // entirely and still reads as the same small inward slide.
      gsap.from(dock, {
        opacity: 0, right: '+=10', duration: 0.6, delay: 2.2, ease: 'power2.out',
        clearProps: 'opacity,right',
      })
    }, dock)

    return () => media.revert()
  }, { scope })

  useEffect(() => {
    const dock = scope.current
    const contact = document.getElementById('contact')
    const hero = document.getElementById('top')
    if (!dock || !contact) return
    const mobile = window.matchMedia('(max-width: 767px)')
    let atContact = false
    let atHero = !!hero && hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < innerHeight
    const update = () => { dock.setAttribute('data-hidden', String(atContact || (mobile.matches && atHero))) }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === contact) atContact = entry.isIntersecting && entry.intersectionRatio >= 0.15
        if (entry.target === hero) atHero = entry.isIntersecting
      }
      update()
    }, { threshold: [0, 0.15] })
    observer.observe(contact)
    if (hero) observer.observe(hero)
    mobile.addEventListener('change', update)
    update()
    return () => { observer.disconnect(); mobile.removeEventListener('change', update) }
  }, [scope])
}

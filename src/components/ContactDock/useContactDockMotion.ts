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
    if (!dock || !contact) return
    const observer = new IntersectionObserver(
      (entries) => { dock.dataset.hidden = String(entries[0]?.isIntersecting ?? false) },
      { threshold: 0.15 },
    )
    observer.observe(contact)
    return () => observer.disconnect()
  }, [scope])
}

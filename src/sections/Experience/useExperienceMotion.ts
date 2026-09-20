import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'

export function useExperienceMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const section = scope.current
    if (!section) return
    const media = gsap.matchMedia()
    const seen = new WeakSet<Element>()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = section.querySelector<HTMLElement>('.experience__intro')!
      // Direct anchor navigation and preference changes leave read content visible.
      // Avoid recreating completed once-triggers during ScrollTrigger refresh.
      const visible = (element: Element, threshold: number) => {
        if (seen.has(element) || element.getBoundingClientRect().top < innerHeight * threshold) {
          seen.add(element)
          return true
        }
        return false
      }
      if (!visible(intro, 0.85)) {
        gsap.from(intro.querySelectorAll('[data-experience-intro]'), {
          y: 16, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          onComplete: () => { seen.add(intro) },
          scrollTrigger: { trigger: intro, start: 'top 85%', once: true },
        })
      }
      section.querySelectorAll<HTMLElement>('[data-experience-row]').forEach((row, index) => {
        if (visible(row, 0.94)) return
        gsap.from(row, {
          y: 16, opacity: 0, duration: 0.55, delay: index * 0.04, ease: 'power3.out',
          onComplete: () => { seen.add(row) },
          scrollTrigger: { trigger: row, start: 'top 94%', once: true },
        })
      })

      let disposed = false
      void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
      return () => { disposed = true }
    }, section)

    return () => media.revert()
  }, { scope })
}

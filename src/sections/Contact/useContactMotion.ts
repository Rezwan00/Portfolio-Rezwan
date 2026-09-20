import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'

export function useContactMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const section = scope.current
    if (!section) return
    const select = gsap.utils.selector(section)
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = section.querySelector<HTMLElement>('.contact__intro')!
      const masks = select('.contact__title-mask')

      // Direct anchor navigation and refreshes leave the already-read chapter
      // in its final layout instead of replaying the entrance underneath it.
      if (intro.getBoundingClientRect().top < innerHeight * 0.8) {
        gsap.set(masks, { clearProps: 'overflow' })
        return
      }

      gsap.set(masks, { overflow: 'hidden' })
      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: intro, start: 'top 80%', once: true },
      })
        .from(select('.contact__ring'), { opacity: 0, scale: 0.92, duration: 1.1, ease: 'power2.out' }, 0)
        .from(select('[data-contact-intro]'), { y: 16, opacity: 0, duration: 0.5 }, 0.1)
        .from(select('[data-contact-word]'), { yPercent: 115, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, 0.2)
        .from(select('[data-contact-copy]'), { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.65)
        .from(select('[data-contact-cta]'), { y: 15, opacity: 0, scale: 0.94, duration: 0.55 }, 0.85)
        .set(masks, { clearProps: 'overflow' }, 1.1)

      let disposed = false
      void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
      return () => { disposed = true }
    }, section)

    return () => media.revert()
  }, { scope })
}

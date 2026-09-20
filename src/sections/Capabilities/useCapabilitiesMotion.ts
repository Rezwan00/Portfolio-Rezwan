import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'

export function useCapabilitiesMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const section = scope.current
    if (!section) return
    const select = gsap.utils.selector(section)
    const media = gsap.matchMedia()
    let revealed = false
    const readRows = new WeakSet<HTMLElement>()

    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      compact: '(max-width: 767px)',
    }, (context) => {
      if (!context.conditions!.motion) return
      const compact = context.conditions!.compact

      // The incoming surface and outgoing Hero share the same native scroll.
      // Only paint moves: no pin, spacer, or change to the Hero composition.
      gsap.from(select('.capabilities__surface'), {
        y: compact ? 24 : 48,
        ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top bottom', end: 'top 60%', scrub: 0.35,
          invalidateOnRefresh: true,
        },
      })

      const reveal = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => { revealed = true },
        scrollTrigger: { trigger: section, start: 'top 65%', once: true },
      })
      const masks = select('.capabilities__line')
      gsap.set(masks, { overflow: 'hidden' })
      reveal
        .from(select('[data-capabilities-intro]'), { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, 0)
        .from(select('[data-capabilities-word]'), { yPercent: 115, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, 0.1)
        .from(select('[data-capabilities-copy]'), { y: 20, opacity: 0, duration: 0.6 }, 0.6)
        .set(masks, { clearProps: 'overflow' }, 1.1)

      // Resizing an already read section must not hide it again.
      if (revealed || section.getBoundingClientRect().top < window.innerHeight * 0.65) reveal.progress(1)
      if (compact) reveal.timeScale(1.15)

      for (const row of select('[data-capabilities-discipline]')) {
        if (readRows.has(row) || row.getBoundingClientRect().top < window.innerHeight * 0.95) continue
        gsap.from(row, {
          y: compact ? 12 : 20, opacity: 0, duration: 0.6, ease: 'power3.out',
          onComplete: () => { readRows.add(row) },
          scrollTrigger: { trigger: row, start: 'top 95%', once: true },
        })
      }

      let disposed = false
      void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
      return () => { disposed = true }
    }, section)

    return () => media.revert()
  }, { scope })
}

import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'

export function useWorkMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const section = scope.current
    if (!section) return
    const select = gsap.utils.selector(section)
    const media = gsap.matchMedia()
    const seen = new WeakSet<Element>()

    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1200px)' }, context => {
      if (!context.conditions!.motion) return
      const desktop = context.conditions!.desktop
      // Already-visible content needs no entrance trigger on a media rebuild.
      // Recreating completed once-triggers can remove them during GSAP's
      // nested refresh while the following image depth triggers initialize.
      const alreadyVisible = (element: Element, threshold: number) => {
        if (seen.has(element) || element.getBoundingClientRect().top < innerHeight * threshold) {
          seen.add(element)
          return true
        }
        return false
      }
      const intro = section.querySelector<HTMLElement>('.work__intro')!
      const introMasks = select('.work__title-mask')
      if (!alreadyVisible(intro, 0.8)) {
        gsap.set(introMasks, { overflow: 'hidden' })
        gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => { seen.add(intro) },
          scrollTrigger: { trigger: intro, start: 'top 80%', once: true },
        })
          .from(select('[data-work-intro]'), { opacity: 0, y: 16, duration: 0.45 }, 0)
          .from(select('[data-work-word]'), { yPercent: 115, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, 0.12)
          .from(select('[data-work-copy]'), { opacity: 0, y: 18, duration: 0.55 }, 0.5)
          .set(introMasks, { clearProps: 'overflow' }, 1.02)
      }

      for (const block of section.querySelectorAll<HTMLElement>('[data-work-reveal]')) {
        if (alreadyVisible(block, 0.9)) continue
        const titles = block.querySelectorAll('[data-project-title]')
        const masks = block.querySelectorAll('.project__title-mask')
        const reveal = gsap.timeline({
          onComplete: () => { seen.add(block) },
          scrollTrigger: { trigger: block, start: 'top 90%', once: true },
        })
        if (titles.length) {
          gsap.set(masks, { overflow: 'hidden' })
          reveal.from(titles, { yPercent: 110, duration: 0.7, stagger: 0.08, ease: 'power4.out' })
            .set(masks, { clearProps: 'overflow' })
        } else {
          reveal.from(block, { opacity: 0, y: 14, duration: 0.55, ease: 'power3.out' })
        }
      }

      const cleanupFocus: Array<() => void> = []
      for (const visual of section.querySelectorAll<HTMLElement>('[data-work-visual]')) {
        const find = gsap.utils.selector(visual)
        const curtain = find('.project__media-curtain')
        if (!alreadyVisible(visual, 0.95)) {
          gsap.set(curtain, { display: 'block', scaleY: 1 })
          const reveal = gsap.timeline({
            onComplete: () => { seen.add(visual) },
            scrollTrigger: { trigger: visual, start: 'top 95%', once: true },
          })
            .to(curtain, { scaleY: 0, duration: desktop ? 0.8 : 0.6, ease: 'power4.inOut' }, 0)
            .from(find('.project__media-reveal'), { scale: desktop ? 1.035 : 1.01, duration: 0.9, ease: 'power3.out' }, 0)
            .set(curtain, { display: 'none' }, 0.8)
          const revealForFocus = () => { reveal.progress(1) }
          visual.addEventListener('focusin', revealForFocus)
          cleanupFocus.push(() => visual.removeEventListener('focusin', revealForFocus))
        }

        // Outer depth moves the complete frame/caption; the entrance only
        // scales its inner image. No transform has competing animation owners.
        if (desktop && !visual.querySelector('video')) {
          const depth = gsap.utils.clamp(-20, 20, Number(visual.dataset.depth ?? 10))
          gsap.fromTo(find('.project__media-depth'), { y: depth }, {
            y: -depth, ease: 'none',
            scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true },
          })
        }
      }

      let disposed = false
      void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
      return () => { disposed = true; cleanupFocus.forEach(remove => remove()) }
    }, section)
    return () => media.revert()
  }, { scope })
}

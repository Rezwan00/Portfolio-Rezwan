import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'

export function useWorkMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const section = scope.current
    if (!section) return
    const select = gsap.utils.selector(section)
    const media = gsap.matchMedia()
    const seen = new WeakSet<Element>()

    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1200px)', catalog: '(min-width: 1024px) and (min-height: 700px)' }, context => {
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
      // Outgoing media or a compact gallery entry holds only after it has been
      // read. Whole chapters stay in flow; no added scroll distance.
      // Pin, catalog scale and existing image entrance each own a wrapper.
      let catalogContext: gsap.Context | undefined
      const buildCatalog = () => {
        catalogContext?.revert()
        if (!context.conditions!.catalog) return
        catalogContext = gsap.context(() => {
          const pairs = [
            ['.ecosystem__website', '.ecosystem__exchange'],
            ['.ecosystem__origin', '.showcase--lightning'],
            ['.technical__platform', '.showcase--web'],
            ['.web-entry--sorrento', '.web-entry--alexis'],
            ['.web-entry--alexis', '.web-entry--xorbix'],
          ] as const
          for (const [outgoing, incoming] of pairs) {
            const visual = section.querySelector<HTMLElement>(outgoing)
            const next = section.querySelector<HTMLElement>(incoming)
            if (!visual || !next || visual.offsetHeight > innerHeight * 0.78
              || visual.querySelector('a, button, video, input, [tabindex]')) continue
            const layer = visual.querySelector('.project__catalog-depth')!
            // Measure before pinning; reading the pinned rect inside a refresh
            // would make the duration depend on the current scroll position.
            const gap = next.getBoundingClientRect().top - visual.getBoundingClientRect().bottom
            const hold = Math.max(120, Math.min(320, gap + innerHeight * 0.18))
            const handoff = gsap.timeline({
              scrollTrigger: {
                trigger: visual, start: 'bottom bottom-=40', end: `+=${hold}`,
                pin: visual, pinSpacing: false, scrub: 0.35, invalidateOnRefresh: true,
                id: `catalog-${outgoing.replace(/[^a-z0-9-]/gi, '')}`, anticipatePin: 0,
              },
            }).to(layer, { scale: 0.94, opacity: 0.72, transformOrigin: '50% 100%', ease: 'none', duration: 1 })
            if (visual.matches('.web-entry')) {
              // Lift the outgoing image AND its metadata above the advancing
              // chapter edge. Text never gets sliced by the incoming screenshot.
              handoff.to(visual, { '--catalog-lift': `${-Math.max(0, hold - gap + 24)}px`, ease: 'none', duration: 1 }, 0)
            }
          }
        }, section)
      }
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

      buildCatalog()
      // A viewport can change without crossing a media-query boundary. Recheck
      // fit rather than retaining a pin that has become taller than the screen.
      let resizeTimer = 0
      const resizeCatalog = () => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => { buildCatalog(); ScrollTrigger.refresh() }, 200)
      }
      window.addEventListener('resize', resizeCatalog)
      let disposed = false
      void document.fonts.ready.then(() => { if (!disposed) { buildCatalog(); ScrollTrigger.refresh() } })
      return () => {
        disposed = true; cleanupFocus.forEach(remove => remove())
        window.clearTimeout(resizeTimer)
        window.removeEventListener('resize', resizeCatalog)
        catalogContext?.revert()
      }
    }, section)
    return () => media.revert()
  }, { scope })
}

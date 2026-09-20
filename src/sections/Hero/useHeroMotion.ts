import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'

/** A shared scope includes Header so its reveal belongs to the Hero timeline. */
export function useHeroMotion(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    const root = scope.current
    if (!root) return
    const select = gsap.utils.selector(root)
    const hero = root.querySelector<HTMLElement>('.hero')!
    const media = gsap.matchMedia()
    let initialized = false

    media.add({
      reduced: '(prefers-reduced-motion: reduce)',
      compact: '(max-width: 1023px)',
      pointer: '(min-width: 1024px) and (hover: hover) and (pointer: fine)',
      all: 'all',
    }, (context) => {
      const { reduced, compact, pointer } = context.conditions!
      // matchMedia reverts all inline states before rebuilding. Preference and
      // breakpoint changes settle immediately instead of replaying the entrance.
      if (reduced) {
        initialized = true
        return
      }

      const word = select('[data-hero-word]')
      const portrait = select('[data-hero-visual]')
      const mask = select('.hero__word-mask')
      const navigation = select(compact && window.innerWidth < 768
        ? '.site-header__menu' : '.site-header__link')
      const arrow = gsap.to(select('.hero__scroll-arrow'), {
        y: 4, duration: 1.1, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
      })
      let entered = false
      const entrance = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          entered = true
          if (hero.getBoundingClientRect().bottom > 0) arrow.play()
        },
      })

      // Only JS activates the mask. The negative-margin ink allowance in CSS
      // preserves the approved tight line box without cutting off glyph edges.
      gsap.set(mask, { overflow: 'hidden' })
      entrance
        .from(select('.site-header__brand'), { opacity: 0, y: -10, duration: 0.4 }, 0)
        .from(navigation, { opacity: 0, y: -8, duration: 0.4, stagger: 0.055 }, 0.08)
        .from(select('[data-hero-intro]'), { opacity: 0, y: 18, duration: 0.55 }, 0.2)
        .from(word, { yPercent: 115, duration: 0.85, ease: 'power4.out' }, 0.32)
        .from(portrait, {
          opacity: 0, y: compact ? 55 : 105, scale: compact ? 0.88 : 0.8,
          rotation: compact ? 0 : 4, duration: 1.05,
        }, 0.48)
        .from(select('[data-hero-role]'), { opacity: 0, y: 25, duration: 0.6 }, 1.05)
        .from(select('[data-hero-statement]'), { opacity: 0, y: 18, duration: 0.6 }, 1.15)
        .from(select('[data-hero-disciplines]'), { opacity: 0, y: 15, duration: 0.55 }, 1.28)
        .from(select('[data-hero-cta]'), { opacity: 0, y: 15, scale: 0.92, duration: 0.6 }, 1.38)
        .from(select('[data-hero-location]'), { opacity: 0, y: 10, duration: 0.5 }, 1.55)
        .from(select('[data-hero-scroll]'), { opacity: 0, y: 8, duration: 0.5 }, 1.65)
        .set(mask, { clearProps: 'overflow' }, 1.17)

      if (compact) entrance.timeScale(1.18)
      if (initialized) entrance.progress(1)
      initialized = true

      // These outer layers have neutral baselines independent of the entrance.
      // A scroll during the reveal therefore composes with it, never overwrites it.
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            if (entered && self.isActive) arrow.play()
            else arrow.pause()
          },
        },
      })
        .to(select('.hero__word-scroll'), { yPercent: compact ? -4 : -13 }, 0)
        .to(select('.hero__visual-scroll'), { yPercent: compact ? -2 : -6, scale: compact ? 0.995 : 0.98 }, 0)
        .to(select('.hero__meta, .hero__aside'), { y: compact ? -8 : -25, opacity: compact ? 0.85 : 0.7 }, 0)

      // Focus never waits for choreography; reveal the complete composition
      // before the browser paints a newly focused link or button.
      const revealForFocus = () => { if (!entered) entrance.progress(1) }
      root.addEventListener('focusin', revealForFocus)

      let removePointer = () => {}
      if (pointer) {
        const options = { duration: 0.65, ease: 'power3.out' }
        const portraitLayer = select('.hero__visual-pointer')
        const wordLayer = select('.hero__word-pointer')
        const portraitX = gsap.quickTo(portraitLayer, 'x', options)
        const portraitY = gsap.quickTo(portraitLayer, 'y', options)
        const portraitRotation = gsap.quickTo(portraitLayer, 'rotation', options)
        const wordX = gsap.quickTo(wordLayer, 'x', options)
        const wordY = gsap.quickTo(wordLayer, 'y', options)
        const move = (event: PointerEvent) => {
          if (!entered || event.pointerType !== 'mouse') return
          const bounds = hero.getBoundingClientRect()
          const x = gsap.utils.clamp(-1, 1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
          const y = gsap.utils.clamp(-1, 1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
          portraitX(x * 16)
          portraitY(y * 10)
          portraitRotation(x * 0.75)
          wordX(x * -5)
          wordY(y * -3)
        }
        const reset = () => {
          portraitX(0); portraitY(0); portraitRotation(0); wordX(0); wordY(0)
        }
        hero.addEventListener('pointermove', move, { passive: true })
        hero.addEventListener('pointerleave', reset)
        hero.addEventListener('pointercancel', reset)
        window.addEventListener('blur', reset)
        removePointer = () => {
          hero.removeEventListener('pointermove', move)
          hero.removeEventListener('pointerleave', reset)
          hero.removeEventListener('pointercancel', reset)
          window.removeEventListener('blur', reset)
        }
      }

      let disposed = false
      // Self-hosted font metrics may settle after the first layout effect.
      void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
      return () => {
        disposed = true
        root.removeEventListener('focusin', revealForFocus)
        removePointer()
      }
    }, root)

    return () => media.revert()
  }, { scope })
}

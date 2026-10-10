import { gsap } from '../../lib/gsap'

/** Stable outer hit area; only the inner visual wrapper follows the pointer. */
export function createHeroMagnet(hero: HTMLElement, isReady: () => boolean) {
  const hitArea = hero.querySelector<HTMLElement>('.hero__cta')!
  const layer = hitArea.querySelector<HTMLElement>('.hero__cta-magnet')!
  const link = hitArea.querySelector<HTMLAnchorElement>('a')!
  const x = gsap.quickTo(layer, 'x', { duration: 0.4, ease: 'power3.out' })
  const y = gsap.quickTo(layer, 'y', { duration: 0.4, ease: 'power3.out' })
  let frame = 0
  let clientX = 0
  let clientY = 0
  let bounds = hitArea.getBoundingClientRect()
  let dirty = false
  let displaced = false
  let animated = false
  const reset = (immediate = false) => {
    cancelAnimationFrame(frame); frame = 0
    if (displaced) { x(0); y(0); displaced = false }
    if (immediate && animated) { x.tween.progress(1); y.tween.progress(1) }
  }
  const rest = () => reset()
  const focus = () => reset(true)
  const measure = () => { bounds = hitArea.getBoundingClientRect(); dirty = false; reset() }
  const invalidate = () => { dirty = true; reset() }
  const move = (event: PointerEvent) => {
    if (!isReady() || event.pointerType !== 'mouse' || document.hidden || link.matches(':focus-visible')) return
    clientX = event.clientX; clientY = event.clientY
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (dirty) { bounds = hitArea.getBoundingClientRect(); dirty = false }
      displaced = true; animated = true
      x(gsap.utils.clamp(-1, 1, (clientX - bounds.left) / bounds.width * 2 - 1) * 6)
      y(gsap.utils.clamp(-1, 1, (clientY - bounds.top) / bounds.height * 2 - 1) * 4)
    })
  }
  hitArea.addEventListener('pointerenter', measure)
  hitArea.addEventListener('pointermove', move, { passive: true })
  hitArea.addEventListener('pointerleave', rest)
  hitArea.addEventListener('pointercancel', rest)
  hitArea.addEventListener('focusin', focus)
  window.addEventListener('scroll', invalidate, { passive: true })
  window.addEventListener('resize', invalidate)
  window.addEventListener('blur', rest)
  document.addEventListener('visibilitychange', rest)
  return () => {
    cancelAnimationFrame(frame)
    hitArea.removeEventListener('pointerenter', measure)
    hitArea.removeEventListener('pointermove', move)
    hitArea.removeEventListener('pointerleave', rest)
    hitArea.removeEventListener('pointercancel', rest)
    hitArea.removeEventListener('focusin', focus)
    window.removeEventListener('scroll', invalidate)
    window.removeEventListener('resize', invalidate)
    window.removeEventListener('blur', rest)
    document.removeEventListener('visibilitychange', rest)
    // The owning matchMedia context reverts the layer's transform.
    x.tween.kill(); y.tween.kill()
  }
}

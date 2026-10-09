export type HeroPointer = { x: number; y: number }
type Listener = (pointer: HeroPointer) => void
const sources = new WeakMap<HTMLElement, { listeners: Set<Listener>; dispose: () => void }>()

/** DOM parallax and WebGL share one sampled pointer and one rest/exit policy.
 * No ticker runs while idle; each animation system owns only its own layer. */
export function subscribeHeroPointer(hero: HTMLElement, listener: Listener) {
  let source = sources.get(hero)
  if (!source) {
    const listeners = new Set<Listener>()
    const fine = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    let frame = 0
    let rest = 0
    let clientX = 0
    let clientY = 0
    let bounds = hero.getBoundingClientRect()
    const emit = (x: number, y: number) => listeners.forEach(fn => fn({ x, y }))
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0
      window.clearTimeout(rest)
      emit(0, 0)
    }
    const measure = () => { bounds = hero.getBoundingClientRect() }
    const scroll = () => { measure(); reset() }
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse' || document.hidden) return
      clientX = event.clientX; clientY = event.clientY
      window.clearTimeout(rest)
      rest = window.setTimeout(reset, 1800)
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const influence = Math.max(0, Math.min(1, bounds.bottom / bounds.height))
        emit(Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1)) * influence,
          Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1)) * influence)
      })
    }
    const resize = new ResizeObserver(measure)
    resize.observe(hero)
    hero.addEventListener('pointerenter', measure)
    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', reset)
    hero.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('scroll', scroll, { passive: true })
    document.addEventListener('visibilitychange', reset)
    fine.addEventListener('change', reset)
    source = { listeners, dispose: () => {
      reset(); resize.disconnect()
      hero.removeEventListener('pointerenter', measure)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', reset)
      hero.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('scroll', scroll)
      document.removeEventListener('visibilitychange', reset)
      fine.removeEventListener('change', reset)
    } }
    sources.set(hero, source)
  }
  source.listeners.add(listener)
  const current = source
  return () => {
    current.listeners.delete(listener)
    if (!current.listeners.size) { current.dispose(); sources.delete(hero) }
  }
}

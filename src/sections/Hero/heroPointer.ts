export type HeroPointer = { x: number; y: number; influence: number }
type Listener = (pointer: HeroPointer) => void
const enabledHeroes = new WeakSet<HTMLElement>()
const sources = new WeakMap<HTMLElement, {
  listeners: Set<Listener>; dispose: () => void; reset: () => void; latest: HeroPointer
}>()

/** The portrait entrance releases both DOM and WebGL interaction together. */
export function setHeroInteractionEnabled(hero: HTMLElement, enabled: boolean) {
  if (enabled) enabledHeroes.add(hero)
  else enabledHeroes.delete(hero)
  sources.get(hero)?.reset()
}

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
    const emit = (x: number, y: number) => {
      const influence = enabledHeroes.has(hero) && !document.hidden
        ? Math.max(0, Math.min(1, (bounds.bottom / bounds.height - 0.15) / 0.85)) : 0
      const value = { x: x * influence, y: y * influence, influence }
      const current = sources.get(hero)
      if (current && current.latest.x === value.x && current.latest.y === value.y
        && current.latest.influence === value.influence) return
      if (current) current.latest = value
      listeners.forEach(fn => fn(value))
    }
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0
      window.clearTimeout(rest)
      emit(0, 0)
    }
    const measure = () => { bounds = hero.getBoundingClientRect() }
    const scroll = () => { measure(); reset() }
    const move = (event: PointerEvent) => {
      if (!enabledHeroes.has(hero) || !fine.matches || event.pointerType !== 'mouse' || document.hidden) return
      clientX = event.clientX; clientY = event.clientY
      window.clearTimeout(rest)
      rest = window.setTimeout(reset, 1800)
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        emit(Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1)),
          Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1)))
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
    source = { listeners, latest: { x: 0, y: 0, influence: 0 }, reset: () => { measure(); reset() }, dispose: () => {
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
    emit(0, 0)
  }
  source.listeners.add(listener)
  listener(source.latest)
  const current = source
  return () => {
    current.listeners.delete(listener)
    if (!current.listeners.size) { current.dispose(); sources.delete(hero) }
  }
}

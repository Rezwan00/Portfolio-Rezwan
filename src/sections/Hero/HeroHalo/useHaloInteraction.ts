import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

/** Pointer values live outside React's render cycle. Canvas never owns events. */
export function useHaloInteraction(host: RefObject<HTMLDivElement | null>) {
  const pointer = useRef({ x: 0, y: 0, lastMove: 0 })
  useEffect(() => {
    const hero = host.current?.closest('.hero')
    if (!hero) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reset = () => { pointer.current.x = 0; pointer.current.y = 0 }
    const move = (event: Event) => {
      const input = event as PointerEvent
      if (!fine.matches || input.pointerType !== 'mouse') return
      const rect = hero.getBoundingClientRect()
      pointer.current.x = Math.max(-1, Math.min(1, (input.clientX - rect.left) / rect.width * 2 - 1))
      pointer.current.y = Math.max(-1, Math.min(1, (input.clientY - rect.top) / rect.height * 2 - 1))
      pointer.current.lastMove = performance.now()
    }
    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', reset)
    hero.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    fine.addEventListener('change', reset)
    return () => {
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', reset)
      hero.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      fine.removeEventListener('change', reset)
    }
  }, [host])
  return pointer
}

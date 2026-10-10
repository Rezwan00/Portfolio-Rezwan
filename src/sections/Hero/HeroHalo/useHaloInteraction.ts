import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { subscribeHeroPointer } from '../heroPointer'
import type { HeroPointer } from '../heroPointer'

/** Pointer values live outside React's render cycle. Canvas never owns events. */
export function useHaloInteraction(host: RefObject<HTMLDivElement | null>) {
  const pointer = useRef<HeroPointer>({ x: 0, y: 0, influence: 0 })
  useEffect(() => {
    const hero = host.current?.closest<HTMLElement>('.hero')
    if (!hero) return
    return subscribeHeroPointer(hero, (value) => { pointer.current = value })
  }, [host])
  return pointer
}

import { useSyncExternalStore } from 'react'

export type HaloQuality = 'high' | 'medium'

const queries = ['(min-width: 768px)', '(min-width: 1200px)', '(prefers-reduced-motion: reduce)']

function subscribe(notify: () => void) {
  const media = queries.map((query) => window.matchMedia(query))
  media.forEach((query) => query.addEventListener('change', notify))
  return () => media.forEach((query) => query.removeEventListener('change', notify))
}

function snapshot(): HaloQuality | 'static' {
  const device = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  if (!window.matchMedia(queries[0]!).matches
    || window.matchMedia(queries[2]!).matches
    || device.connection?.saveData
    || (device.deviceMemory !== undefined && device.deviceMemory <= 2)
    || (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 2)) return 'static'
  return window.matchMedia(queries[1]!).matches ? 'high' : 'medium'
}

/** Mobile, reduced motion, data saving and explicitly weak devices stay static. */
export function useHaloQuality() {
  return useSyncExternalStore(subscribe, snapshot, () => 'static' as const)
}

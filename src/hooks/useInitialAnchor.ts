import { useLayoutEffect } from 'react'

/** React may mount after the browser's first attempt to resolve a URL fragment. */
export function useInitialAnchor() {
  useLayoutEffect(() => {
    const hash = window.location.hash
    const target = hash && document.getElementById(hash.slice(1))
    if (!target) return
    let cancelled = false
    const cancel = () => { cancelled = true }
    const restore = () => {
      if (!cancelled && window.location.hash === hash) target.scrollIntoView({ block: 'start', behavior: 'auto' })
    }
    let frame = requestAnimationFrame(restore)
    // Resolve again after local font metrics settle, unless the user has taken
    // control. Normal subsequent hash navigation remains entirely native.
    void document.fonts.ready.then(() => {
      if (!cancelled) { cancelAnimationFrame(frame); frame = requestAnimationFrame(restore) }
    })
    const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    inputs.forEach(type => window.addEventListener(type, cancel, { passive: true }))
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      inputs.forEach(type => window.removeEventListener(type, cancel))
    }
  }, [])
}

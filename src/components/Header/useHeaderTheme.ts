import { useLayoutEffect, type RefObject } from 'react'

/** One surface resolver for every chapter; independent of motion preferences. */
export function useHeaderTheme(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const header = scope.current
    const main = document.querySelector('main')
    if (!header || !main) return
    const sections = [...main.querySelectorAll<HTMLElement>(':scope > section')]
    let frame = 0
    const update = () => {
      frame = 0
      const sampleY = header.getBoundingClientRect().height / 2
      const active = sections.find(section => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= sampleY && bounds.bottom > sampleY
      })
      header.setAttribute('data-surface', active?.classList.contains('theme-light') ? 'light' : 'dark')
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    observer.observe(main)
    observer.observe(header)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
    }
  }, [scope])
}

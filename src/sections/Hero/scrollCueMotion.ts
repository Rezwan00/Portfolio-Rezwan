/** CSS owns the continuous transform; this controller only pauses/resumes it.
 * Cue visibility is independent of ScrollTrigger's progress at the page top. */
export function createScrollCueMotion(cue: HTMLElement) {
  let entered = false
  let visible = false
  const update = () => {
    cue.dataset.animating = String(entered && visible && !document.hidden)
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    update()
  })
  observer.observe(cue)
  document.addEventListener('visibilitychange', update)
  update()
  return {
    start() { entered = true; update() },
    destroy() {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      delete cue.dataset.animating
    },
  }
}

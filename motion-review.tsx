/* global document, window, URLSearchParams, Event, PointerEvent, requestAnimationFrame, performance, HTMLCanvasElement */
// Local-only review entry. Never imported by the portfolio or normal build.
import { createRoot } from 'react-dom/client'
import './src/styles/global.css'
import { ScrollTrigger } from './src/lib/gsap'

// Renderer counters live only in this QA entry, never in the halo subsystem.
let draws = 0
const contexts = new WeakSet<object>()
const getContext = HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof getContext>) {
  const context = getContext.apply(this, args)
  if (context && 'drawElements' in context && !contexts.has(context)) {
    contexts.add(context)
    const gl = context as WebGL2RenderingContext
    const draw = gl.drawElements.bind(gl)
    gl.drawElements = (...parameters) => { draws++; draw(...parameters) }
  }
  return context
} as typeof getContext

const reduced = new URLSearchParams(window.location.search).has('reduced')
if (reduced) {
  const actual = window.matchMedia.bind(window)
  window.matchMedia = (query) => {
    const media = actual(query)
    if (query.includes('prefers-reduced-motion')) {
      Object.defineProperty(media, 'matches', { value: !query.includes('no-preference') })
    }
    return media
  }
}
const { default: App } = await import('./src/App')
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
const controls = document.getElementById('qa-controls')!
controls.style.cssText = 'position:fixed;top:0;left:0;z-index:100;background:#fff;color:#000;padding:4px;font:12px sans-serif;max-width:100%;display:flex;flex-wrap:wrap;gap:4px'
const output = document.createElement('output')
output.id = 'review-results'
function button(label: string, action: () => void) {
  const element = document.createElement('button')
  element.textContent = label
  element.onclick = action
  controls.append(element)
}
button('Hero', () => document.getElementById('top')!.scrollIntoView())
button('Work', () => document.getElementById('work')!.scrollIntoView())
button('Handoff', () => {
  const trigger = ScrollTrigger.getAll().find(t => t.vars.id === 'catalog-web-entry--sorrento')
  if (trigger) window.scrollTo(0, trigger.start + (trigger.end - trigger.start) * 0.65)
})
button('Reverse', () => {
  const trigger = ScrollTrigger.getAll().find(t => t.vars.id === 'catalog-web-entry--sorrento')
  if (trigger) window.scrollTo(0, trigger.start - 250)
})
button('Measure scroll', () => {
  const start = performance.now()
  const times: number[] = []
  let last = start
  const from = document.getElementById('work')!.offsetTop
  const sample = (now: number) => {
    times.push(now - last); last = now
    window.scrollTo(0, from + Math.sin(Math.min(1, (now - start) / 6000) * Math.PI) * 4100)
    if (now - start < 6000) requestAnimationFrame(sample)
    else { times.sort((a, b) => a - b); output.textContent = JSON.stringify({ fps: times.length / ((now - start) / 1000), p95: times[Math.floor(times.length * 0.95)] }) }
  }
  requestAnimationFrame(sample)
})
button('Inspect', () => {
  output.textContent = JSON.stringify({ reduced, triggers: ScrollTrigger.getAll().length, pins: ScrollTrigger.getAll().filter(t => t.vars.pin).length, canvas: !!document.querySelector('.hero canvas'), draws })
})
button('Pointer sweep', () => {
  const hero = document.querySelector<HTMLElement>('.hero')!
  const start = performance.now()
  let frames = 0
  const before = draws
  const sample = (now: number) => {
    frames++
    const t = now - start
    const rect = hero.getBoundingClientRect()
    hero.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: rect.left + rect.width * (0.5 + 0.45 * Math.sin(t / 450)), clientY: rect.top + rect.height * (0.5 + 0.45 * Math.cos(t / 550)) }))
    if (t < 6000) requestAnimationFrame(sample)
    else { hero.dispatchEvent(new PointerEvent('pointerleave')); output.textContent = JSON.stringify({ fps: frames / (t / 1000), draws: draws - before }) }
  }
  requestAnimationFrame(sample)
})
button('Lose context', () => document.querySelector<HTMLCanvasElement>('.hero canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext())
button('Unmount', () => { root.unmount(); output.textContent = `remaining triggers: ${ScrollTrigger.getAll().length}` })
button('Hide tab', () => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
button('Show tab', () => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')) })
controls.append(output)

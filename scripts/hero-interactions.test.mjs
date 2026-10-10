// Deterministic behavior checks. These do not replace browser/GPU or layout QA.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const { gsap } = require('gsap')
const three = require('three')
const load = (file, mocks, environment = {}) => {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText
  const exports = {}
  runInNewContext(compiled, { exports, require: name => mocks[name] ?? require(name), ...environment })
  return exports
}

class Events {
  listeners = new Map()
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type).add(listener)
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener) }
  dispatch(type, event = {}) { this.listeners.get(type)?.forEach(listener => listener(event)) }
  get count() { return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0) }
}

function environment() {
  const frames = new Map(), timers = new Map(), observers = []
  let id = 0
  const window = new Events(), document = new Events(), media = new Events()
  media.matches = true
  Object.assign(window, {
    matchMedia: () => media,
    setTimeout: callback => { timers.set(++id, callback); return id },
    clearTimeout: id => timers.delete(id),
  })
  document.hidden = false
  return { window, document, media, frames, timers, observers,
    innerHeight: 900,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id },
    cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: class {
      constructor() { observers.push(this) }
      observe() {}
      disconnect() { this.disconnected = true }
    },
    flush() { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()) },
  }
}

test('shared pointer gates entrance, caches input, attenuates on scroll and cleans up', () => {
  const env = environment(), hero = new Events()
  let bounds = { left: 0, top: 0, bottom: 900, width: 1440, height: 900 }
  hero.getBoundingClientRect = () => bounds
  const { subscribeHeroPointer, setHeroInteractionEnabled } = load('src/sections/Hero/heroPointer.ts', {}, env)
  let portrait, halo
  const removePortrait = subscribeHeroPointer(hero, value => { portrait = value })
  hero.dispatch('pointermove', { pointerType: 'mouse', clientX: 1440, clientY: 900 })
  assert.equal(env.frames.size, 0, 'input is gated until entrance releases it')
  assert.equal(portrait.influence, 0)
  setHeroInteractionEnabled(hero, true)
  for (let i = 0; i < 10; i++) hero.dispatch('pointermove', { pointerType: 'mouse', clientX: 1440, clientY: 900 })
  assert.equal(env.frames.size, 1, 'one sample per frame')
  env.flush()
  assert.equal(portrait.x, 1)
  const removeHalo = subscribeHeroPointer(hero, value => { halo = value })
  assert.equal(halo, portrait, 'late WebGL subscription inherits current input')
  assert.equal(hero.listeners.get('pointermove').size, 1)
  // Slow movement samples each frame; rapid reversals keep only the newest input.
  for (const clientX of [0, 360, 720, 1080, 1440]) {
    hero.dispatch('pointermove', { pointerType: 'mouse', clientX, clientY: 450 })
    env.flush()
    assert.equal(halo.x, clientX / 720 - 1)
    assert.equal(halo.y, 0)
  }
  for (const clientX of [0, 1440, 0, 1440, 360]) {
    hero.dispatch('pointermove', { pointerType: 'mouse', clientX, clientY: 450 })
  }
  assert.equal(env.frames.size, 1)
  env.flush()
  assert.equal(halo.x, -0.5)
  hero.dispatch('pointermove', { pointerType: 'mouse', clientX: 1440, clientY: 900 })
  hero.dispatch('pointerleave')
  env.flush()
  assert.equal(halo.x, 0, 'exit cancels a queued sample instead of restoring stale input')
  bounds = { ...bounds, top: -450, bottom: 450 }
  env.window.dispatch('scroll')
  assert.equal(halo.x, 0)
  assert.ok(halo.influence > 0 && halo.influence < 0.5)
  env.document.hidden = true; env.document.dispatch('visibilitychange')
  assert.equal(halo.influence, 0)
  env.document.hidden = false; env.document.dispatch('visibilitychange')
  assert.ok(halo.influence > 0)
  env.media.matches = false
  hero.dispatch('pointermove', { pointerType: 'mouse', clientX: 0, clientY: 0 })
  assert.equal(env.frames.size, 0, 'coarse/compact input stays static')
  setHeroInteractionEnabled(hero, false)
  assert.equal(portrait.influence, 0)
  removePortrait(); removeHalo()
  assert.equal(hero.count + env.window.count + env.document.count + env.media.count, 0)
  assert.equal(env.frames.size + env.timers.size, 0)
  assert.ok(env.observers.every(observer => observer.disconnected))
})

test('CTA magnet stays bounded and resets for keyboard, exit and scrolling', () => {
  const env = environment(), hit = new Events(), layer = { x: 0, y: 0 }
  let ready = false, keyboard = false
  const link = { matches: () => keyboard }
  hit.getBoundingClientRect = () => ({ left: 100, top: 100, width: 220, height: 64 })
  hit.querySelector = selector => selector === 'a' ? link : layer
  const hero = { querySelector: () => hit }
  const tweens = []
  const library = { ...gsap, quickTo: (...args) => {
    const quick = gsap.quickTo(...args); tweens.push(quick.tween); return quick
  } }
  const { createHeroMagnet } = load('src/sections/Hero/heroMagnet.ts', { '../../lib/gsap': { gsap: library } }, env)
  const remove = createHeroMagnet(hero, () => ready)
  const move = () => {
    hit.dispatch('pointermove', { pointerType: 'mouse', clientX: 320, clientY: 164 })
    const sampled = env.frames.size > 0
    env.flush()
    if (sampled) tweens.forEach(t => t.progress(1))
  }
  move(); assert.equal(layer.x, 0)
  ready = true; move()
  assert.equal(layer.x, 6); assert.equal(layer.y, 4)
  keyboard = true; hit.dispatch('focusin')
  assert.equal(layer.x, 0); assert.equal(layer.y, 0)
  move(); assert.equal(layer.x, 0)
  keyboard = false; move(); hit.dispatch('pointerleave'); tweens.forEach(t => t.progress(1))
  assert.equal(layer.x, 0)
  move(); env.window.dispatch('scroll'); tweens.forEach(t => t.progress(1))
  assert.equal(layer.y, 0)
  remove()
  assert.equal(hit.count + env.window.count + env.document.count, 0)
  assert.equal(env.frames.size, 0)
  assert.ok(tweens.every(tween => !tween.parent))
  gsap.ticker.sleep()
})

test('quality policy keeps mobile, reduced motion and weak devices on static fallback', () => {
  for (const [width, reduced, memory, expected] of [
    ...[320, 375, 390, 430].map(width => [width, false, 8, 'static']),
    ...[768, 1024].map(width => [width, false, 8, 'medium']),
    ...[1280, 1440, 1920].map(width => [width, false, 8, 'high']),
    [1440, true, 8, 'static'], [1440, false, 2, 'static'],
  ]) {
    const api = load('src/sections/Hero/HeroHalo/useHaloQuality.ts', {
      react: { useSyncExternalStore: (_, snapshot) => snapshot() },
    }, {
      navigator: { deviceMemory: memory, hardwareConcurrency: 8 },
      window: { matchMedia: query => ({ matches: query.includes('reduce') ? reduced : width >= (query.includes('1200') ? 1200 : 768) }) },
    })
    assert.equal(api.useHaloQuality(), expected)
  }
})

test('Canvas lifecycle pauses offscreen/hidden and reports WebGL failure without a renderer', async () => {
  const env = environment(), observers = [], effects = [], cleanups = [], activity = []
  const element = new Events(), hero = {}, host = { current: { closest: () => hero } }
  let stateIndex = 0, failures = 0, renderers = 0
  const api = load('src/sections/Hero/HeroHalo/HeroHaloCanvas.tsx', {
    react: {
      useRef: () => ({ current: element }),
      useState: initial => [initial, stateIndex++ === 0 ? value => activity.push(value) : () => {}],
      useEffect: effect => effects.push(effect),
    },
    '@react-three/fiber': { Canvas: 'canvas', useFrame: () => {} },
    three: { WebGLRenderer: class { constructor() { renderers++ } } },
    './GlassHalo': { GlassHalo: 'halo' },
    './HaloLighting': { HaloLighting: 'lighting' },
    './useHaloInteraction': { useHaloInteraction: () => ({ current: { x: 0, y: 0, influence: 0 } }) },
  }, { ...env, IntersectionObserver: class {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  } })
  const result = api.default({ host, quality: 'high', onReady: () => {}, onFailure: () => { failures++ } })
  effects.forEach(effect => cleanups.push(effect()))
  assert.equal(result.props.frameloop, 'never', 'no continuous render before visibility is established')
  observers[0].callback([{ isIntersecting: true }])
  env.document.hidden = true; env.document.dispatch('visibilitychange')
  env.document.hidden = false; env.document.dispatch('visibilitychange')
  observers[0].callback([{ isIntersecting: false }])
  observers[0].callback([{ isIntersecting: true }])
  assert.deepEqual(activity, [true, false, true, false, true])
  let prevented = false
  element.dispatch('webglcontextlost', { preventDefault: () => { prevented = true } })
  assert.equal(failures, 1); assert.equal(prevented, true)
  // The null-context promise intentionally stays pending until its parent unmounts.
  void result.props.gl({ canvas: { getContext: () => null } })
  assert.equal(failures, 2); assert.equal(renderers, 0)
  void result.props.gl({ canvas: { getContext: () => { throw new Error('GPU blocked') } } })
  assert.equal(failures, 3); assert.equal(renderers, 0)
  await result.props.gl({ canvas: { getContext: () => ({}) } })
  assert.equal(renderers, 1)
  cleanups.forEach(cleanup => cleanup?.())
  assert.ok(observers.every(observer => observer.disconnected))
  assert.equal(element.count + env.document.count, 0)
})

test('halo damping is frame-rate independent and returns to neutral', () => {
  const states = []
  for (const fps of [30, 60, 120]) {
    let frame
    const disposals = []
    const group = { rotation: { x: 1.1, y: 0.12, z: 0 }, position: { x: 0, y: -0.05 } }
    const pointer = { current: { x: 0, y: 0, influence: 0 } }
    const { GlassHalo } = load('src/sections/Hero/HeroHalo/GlassHalo.tsx', {
      react: { useRef: value => ({ current: value === null ? group : value }), useMemo: fn => fn(), useEffect: fn => disposals.push(fn()) },
      '@react-three/fiber': { useFrame: fn => { frame = fn } },
      '@react-three/drei/core/MeshTransmissionMaterial': { MeshTransmissionMaterial: () => null },
      three,
    })
    GlassHalo({ quality: 'high', pointer })
    for (let i = 0; i < fps; i++) frame(null, 1 / fps)
    assert.equal(group.rotation.x, 1.1, 'no idle before entrance release')
    pointer.current = { x: 0.8, y: -0.4, influence: 1 }
    for (let i = 0; i < fps; i++) frame(null, 1 / fps)
    states.push({ ...group.rotation })
    assert.ok(group.rotation.y > 0.3 && group.rotation.y < 0.45)
    pointer.current = { x: 0, y: 0, influence: 0 }
    for (let i = 0; i < fps * 2; i++) frame(null, 1 / fps)
    assert.ok(Math.abs(group.rotation.x - 1.1) < 0.0001)
    disposals.forEach(dispose => dispose?.())
  }
  for (const state of states) for (const axis of ['x', 'y', 'z']) assert.ok(Math.abs(state[axis] - states[1][axis]) < 0.001)
})

test('dock is hidden/inert on mobile Hero, restores below it, and hides on reverse', () => {
  const env = environment(), callbacks = [], cleanups = []
  const attrs = new Map([['inert', ''], ['data-hidden', 'true']])
  const dock = { setAttribute: (key, value) => attrs.set(key, value), toggleAttribute: (key, value) => value ? attrs.set(key, '') : attrs.delete(key) }
  const hero = { getBoundingClientRect: () => ({ top: 0, bottom: 1100 }) }
  const contact = { getBoundingClientRect: () => ({ top: 6000, bottom: 7000, height: 1000 }) }
  env.document.getElementById = id => id === 'top' ? hero : contact
  const api = load('src/components/ContactDock/useContactDockMotion.ts', {
    react: { useLayoutEffect: fn => cleanups.push(fn()) },
    '../../lib/gsap': { useGSAP: () => {}, gsap: {} },
  }, { ...env, IntersectionObserver: class {
    constructor(callback, options) { this.callback = callback; this.options = options; callbacks.push(this) }
    observe(target) { this.target = target }
    disconnect() { this.disconnected = true }
  } })
  api.useContactDockMotion({ current: dock })
  assert.equal(attrs.get('data-hidden'), 'true'); assert.ok(attrs.has('inert'))
  const observer = callbacks.find(o => o.target === hero)
  assert.equal(observer.options.rootMargin, '80px 0px 0px')
  observer.callback([{ isIntersecting: false }])
  assert.equal(attrs.get('data-hidden'), 'false'); assert.ok(!attrs.has('inert'))
  observer.callback([{ isIntersecting: true }])
  assert.equal(attrs.get('data-hidden'), 'true')
  env.media.matches = false; env.media.dispatch('change')
  assert.equal(attrs.get('data-hidden'), 'false', 'desktop retains its dock')
  callbacks.find(o => o.target === contact).callback([{ isIntersecting: true, intersectionRatio: 0.2 }])
  assert.equal(attrs.get('data-hidden'), 'true')
  cleanups.forEach(fn => fn())
  assert.ok(callbacks.every(o => o.disconnected))
  assert.equal(env.media.count, 0)
})

test('Work handoffs preserve settled arrivals and reversible transforms across scroll speeds', () => {
  // Flow rectangles are simulated; actual GSAP tweens and the production builder run.
  // This checks choreography, not browser pin placement, overlap or frame rate.
  for (const height of [768, 900, 1024, 1080]) {
    const frames = new Map(), timelines = [], pins = [], tweens = []
    const add = (selector, top, left = 0) => {
      const rect = { top, bottom: top + 380, left, right: left + 800, width: 800, height: 380 }
      const arrival = { x: 0, y: 0, scale: 1, transformOrigin: '50% 0%', getBoundingClientRect: () => rect }
      const departure = { x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: '50% 80%' }
      const node = {
        arrival, departure, '--catalog-lift': '0px',
        getBoundingClientRect: () => rect,
        querySelector: query => query === '.project__arrival' ? arrival : query === '.project__catalog-depth' ? departure : null,
        matches: query => query === '.web-entry' && selector.startsWith('.web-entry'),
      }
      frames.set(selector, node)
      return node
    }
    add('.ecosystem__website', 0)
    add('.ecosystem__exchange', 500, 360)
    add('.ecosystem__origin', 1000)
    add('.showcase--lightning', 1600)
    add('.technical__website', 1900, 360)
    add('.technical__platform', 2700)
    add('.showcase--web', 3400)
    for (const [index, name] of ['sorrento', 'alexis', 'xorbix'].entries()) {
      const selector = `.web-entry--${name}`
      const node = add(selector, 3800 + index * 950, index % 2 * 360)
      frames.set(`${selector} .project-visual`, node)
    }
    const library = {
      ...gsap,
      timeline: ({ scrollTrigger, ...vars }) => {
        const timeline = gsap.timeline({ ...vars, paused: true })
        timelines.push({ timeline, scrollTrigger })
        return timeline
      },
      to: (target, { scrollTrigger, ...vars }) => {
        if (scrollTrigger) assert.equal(scrollTrigger.scrub, true, 'caption clearance must not lag fast scrolling')
        const tween = gsap.to(target, { ...vars, paused: true }); tweens.push(tween); return tween
      },
      fromTo: (target, from, { scrollTrigger: _trigger, ...vars }) => {
        const tween = gsap.fromTo(target, from, { ...vars, paused: true }); tweens.push(tween); return tween
      },
    }
    const { createWorkExhibition } = load('src/sections/Work/workExhibition.ts', {
      '../../lib/gsap': { gsap: library, ScrollTrigger: { create: vars => { pins.push(vars); return vars } } },
    }, { window: { innerHeight: height }, scrollY: 0, document: { createRange: () => ({}) } })
    createWorkExhibition({ querySelector: selector => frames.get(selector), querySelectorAll: () => [] })
    assert.equal(timelines.length, 6)
    const arrived = new Map()
    for (const { timeline, scrollTrigger } of timelines) {
      const children = timeline.getChildren(false, true, false)
      const departure = children.find(tween => [...frames.values()].some(node => node.departure === tween.targets()[0]))
      const arrival = children.find(tween => tween !== departure)
      const span = scrollTrigger.end - scrollTrigger.start
      const departingNode = [...frames.values()].find(node => node.departure === departure.targets()[0])
      const priorArrivalEnd = arrived.get(departingNode.arrival)
      if (priorArrivalEnd !== undefined) {
        assert.ok(scrollTrigger.start + departure.startTime() * span >= priorArrivalEnd + height * 0.06 - 0.001)
      }
      arrived.set(arrival.targets()[0], scrollTrigger.end)
      const snapshot = () => [departure.targets()[0], arrival.targets()[0]].map(node => [node.x, node.y, node.scale])
      for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
        timeline.progress(progress)
        const expected = snapshot()
        timeline.progress(1); timeline.progress(0); timeline.progress(progress)
        assert.deepEqual(snapshot(), expected, 'large jumps and reverse seeks restore the same transforms')
      }
      timeline.kill()
    }
    assert.ok(pins.every(pin => pin.pinSpacing === false && pin.end - pin.start <= 280))
    tweens.forEach(tween => tween.kill())
  }
  gsap.ticker.sleep()
})

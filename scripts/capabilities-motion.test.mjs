// Actual GSAP timelines with simulated elements; not browser layout/FPS testing.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const { gsap } = require('gsap')
const source = readFileSync(new URL('../src/sections/Capabilities/useCapabilitiesMotion.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
} }).outputText

function mount(width, motion = true) {
  const timelines = [], triggers = [], nodes = new Map()
  const element = () => ({ x: 0, y: 0, yPercent: 0, opacity: 1, overflow: 'visible', clearProps: '' })
  const rows = Array.from({ length: 4 }, () => {
    const parts = new Map([['dt', element()], ['dd', element()],
      ['.capabilities__number', { color: '#666666' }], ['.capabilities__name', element()]])
    return { '--capability-progress': 0, parts, querySelector: key => parts.get(key) }
  })
  nodes.set('[data-capabilities-discipline]', rows)
  const select = key => {
    if (!nodes.has(key)) nodes.set(key, [element()])
    return nodes.get(key)
  }
  let cleanup, context
  const library = {
    ...gsap,
    utils: { ...gsap.utils, selector: () => select },
    matchMedia: () => ({
      add: (_, callback) => { context = gsap.context(() => callback({ conditions: { motion, compact: width < 768 } })) },
      revert: () => context.revert(),
    }),
    timeline: ({ scrollTrigger, ...vars }) => {
      triggers.push(scrollTrigger)
      const timeline = gsap.timeline({ ...vars, paused: true })
      if (rows.includes(scrollTrigger.trigger)) timelines.push(timeline)
      return timeline
    },
    from: (target, { scrollTrigger, ...vars }) => {
      triggers.push(scrollTrigger)
      return gsap.from(target, { ...vars, paused: true })
    },
  }
  const exports = {}
  runInNewContext(compiled, {
    exports,
    require: () => ({ gsap: library, ScrollTrigger: { refresh: () => {} }, useGSAP: fn => { cleanup = fn() } }),
    window: { innerHeight: 900 }, document: { fonts: { ready: Promise.resolve() } },
  })
  exports.useCapabilitiesMotion({ current: { getBoundingClientRect: () => ({ top: 1200 }) } })
  return { rows, timelines, triggers, unmount: () => { cleanup(); gsap.ticker.sleep() } }
}

test('Capabilities rows remain readable, reversible and settled at the Work boundary', () => {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    const fixture = mount(width)
    assert.equal(fixture.timelines.length, 4)
    assert.ok(fixture.triggers.every(trigger => !trigger.pin), 'no pin or artificial scroll distance')
    for (const [index, timeline] of fixture.timelines.entries()) {
      const row = fixture.rows[index], term = row.parts.get('dt'), description = row.parts.get('dd')
      const name = row.parts.get('.capabilities__name')
      const snapshot = () => [term.y, description.y, name.x, row['--capability-progress']]
      for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
        timeline.progress(progress)
        const expected = snapshot()
        assert.equal(term.opacity, 1); assert.equal(description.opacity, 1)
        assert.ok(name.x >= 0 && name.x <= (width < 768 ? 0 : 8))
        timeline.progress(1); timeline.progress(0); timeline.progress(progress)
        assert.deepEqual(snapshot(), expected, 'reverse scrolling and large jumps restore the same state')
      }
      timeline.progress(1)
      assert.deepEqual(snapshot(), [0, 0, 0, 1], 'all text settles before leaving its reading window')
    }
    fixture.unmount()
    for (const row of fixture.rows) {
      assert.equal(row.parts.get('dt').y, 0)
      assert.equal(row.parts.get('.capabilities__name').x, 0)
      assert.equal(row['--capability-progress'], 0)
    }
    assert.ok(fixture.timelines.every(timeline => !timeline.parent))
  }
})

test('reduced motion creates no Capabilities animations on desktop or mobile', () => {
  for (const width of [390, 1440]) {
    const fixture = mount(width, false)
    assert.equal(fixture.triggers.length, 0)
    assert.equal(fixture.timelines.length, 0)
    fixture.unmount()
  }
})

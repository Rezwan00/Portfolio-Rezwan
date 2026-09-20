import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WebGLRenderer } from 'three'
import { GlassHalo } from './GlassHalo'
import { HaloLighting } from './HaloLighting'
import { useHaloInteraction } from './useHaloInteraction'
import type { HaloQuality } from './useHaloQuality'

type Props = {
  host: RefObject<HTMLDivElement | null>
  quality: HaloQuality
  onReady: () => void
  onFailure: () => void
}

function FrameHealth({ active, onReady, onSlow }: {
  active: boolean; onReady: () => void; onSlow: () => void
}) {
  const frames = useRef({ ready: false, count: 0, seconds: 0, warmup: 0, resumed: true })
  useEffect(() => {
    frames.current.count = 0
    frames.current.seconds = 0
    frames.current.warmup = 0
    frames.current.resumed = true
  }, [active])
  useFrame((_, delta) => {
    const stats = frames.current
    if (!active || stats.resumed) {
      stats.resumed = false
      return
    }
    if (!stats.ready) {
      stats.count++
      if (stats.count >= 3) { stats.ready = true; onReady(); stats.count = 0 }
      return
    }
    // A one-time hitch (first PMREM/shader compile, tab-switch resume) must not
    // read as sustained slowness: clamp what any single frame can contribute.
    const dt = Math.min(delta, 0.1)
    stats.warmup += dt
    if (stats.warmup < 4) return
    stats.seconds += dt
    stats.count++
    // Sustained low frame rate lowers cost once, then restores the artwork if
    // necessary. Initial loading, background tabs and resume gaps don't count.
    if (stats.seconds >= 4) {
      if (stats.count / stats.seconds < 40) onSlow()
      stats.count = 0; stats.seconds = 0
    }
  })
  return null
}

export default function HeroHaloCanvas({ host, quality, onReady, onFailure }: Props) {
  const [active, setActive] = useState(false)
  const [cheaper, setCheaper] = useState(false)
  const pointer = useHaloInteraction(host)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const actualQuality = cheaper ? 'medium' : quality

  useEffect(() => {
    const hero = host.current?.closest('.hero')
    if (!hero) return
    let inView = false
    const update = () => setActive(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false
      update()
    }, { threshold: 0 })
    observer.observe(hero)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [host])

  useEffect(() => {
    const element = canvas.current
    const lost = (event: Event) => { event.preventDefault(); onFailure() }
    element?.addEventListener('webglcontextlost', lost)
    return () => element?.removeEventListener('webglcontextlost', lost)
  }, [onFailure])

  return (
    <Canvas
      ref={canvas}
      aria-hidden="true"
      tabIndex={-1}
      dpr={actualQuality === 'high' ? [1, 1.5] : 1}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 30, near: 0.1, far: 30 }}
      gl={async (props) => {
        const element = props.canvas as HTMLCanvasElement
        try {
          const context = element.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
          if (context && document.getElementById('shader-info')) {
            const link = context.linkProgram.bind(context)
            context.linkProgram = (program) => {
              link(program)
              if (context.getProgramInfoLog(program)) {
                const shaders = context.getAttachedShaders(program) ?? []
                const shader = shaders.find((item) => context.getShaderParameter(item, context.SHADER_TYPE) === context.FRAGMENT_SHADER)
                if (shader) document.getElementById('shader-info')!.textContent = context.getShaderSource(shader)
              }
            }
          }
          if (context) return new WebGLRenderer({ ...props, context, alpha: true, antialias: true, powerPreference: 'low-power' })
        } catch {
          // Some blocked GPU configurations throw instead of returning null.
        }
          onFailure()
          // The parent unmounts this Canvas. No renderer is created (or noisy
          // Three.js error thrown) on devices that do not support WebGL2.
          return new Promise<WebGLRenderer>(() => {})
      }}
    >
      <HaloLighting />
      <GlassHalo quality={actualQuality} pointer={pointer} />
      <FrameHealth active={active} onReady={onReady} onSlow={() => {
        if (actualQuality === 'high') setCheaper(true)
        else onFailure()
      }} />
    </Canvas>
  )
}

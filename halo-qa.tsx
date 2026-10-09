import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import HeroHaloCanvas from './src/sections/Hero/HeroHalo/HeroHaloCanvas'

function Test() {
  const host = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('Initializing')
  const [mounted, setMounted] = useState(true)
  return <div style={{ background: '#050505', color: '#fff', minHeight: '250vh', fontFamily: 'sans-serif' }}>
    <section className="hero" style={{ height: '100vh' }}>
      <h1>Isolated halo verification</h1>
      <p role="status">{status}</p>
      <button onClick={() => setMounted(!mounted)}>Toggle canvas</button>
      {['Top left', 'Top right', 'Bottom left', 'Bottom right', 'Exit'].map((label, index) => <button key={label} onClick={() => {
        const hero = host.current!.closest('.hero')!
        const rect = hero.getBoundingClientRect()
        hero.dispatchEvent(new PointerEvent(index === 4 ? 'pointerleave' : 'pointermove', { pointerType: 'mouse', clientX: rect.left + rect.width * (index % 2 ? 0.95 : 0.05), clientY: rect.top + rect.height * (index < 2 ? 0.05 : 0.95) }))
      }}>{label}</button>)}
      <button onClick={() => {
        const hero = host.current!.closest('.hero')!
        const start = performance.now()
        const timer = window.setInterval(() => {
          const t = performance.now() - start
          const rect = hero.getBoundingClientRect()
          hero.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: rect.left + rect.width * (0.5 + 0.45 * Math.sin(t / 170)), clientY: rect.top + rect.height * (0.5 + 0.45 * Math.cos(t / 240)) }))
          if (t > 10000) window.clearInterval(timer)
        }, 16)
      }}>Rapid pointer sweep</button>
      <button onClick={() => host.current?.querySelector('canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext()}>Lose context</button>
      <div ref={host} style={{ width: 500, maxWidth: '100%', height: 540, margin: 'auto', pointerEvents: 'none' }}>
        {mounted && <HeroHaloCanvas host={host} quality="high" onReady={() => setStatus('WebGL ready')} onFailure={() => { setStatus('Static fallback requested'); setMounted(false) }} />}
      </div>
    </section>
    <p>Scroll destination</p>
  </div>
}
createRoot(document.getElementById('root')!).render(<Test />)

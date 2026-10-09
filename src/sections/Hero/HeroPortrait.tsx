import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import legacyCompositeSrc from '../../assets/portrait/rezwan-hero.webp'
import { HaloBoundary } from './HeroHalo/HaloBoundary'
import { useHaloQuality } from './HeroHalo/useHaloQuality'
import type { HaloQuality } from './HeroHalo/useHaloQuality'
import './HeroHalo/HeroHalo.css'

const HaloCanvas = lazy(() => import('./HeroHalo/HeroHaloCanvas'))
// Optional at build time so a missing artwork delivery cannot break the Hero.
const portraits = import.meta.glob<string>('../../assets/portrait/rezwan-portrait-only.webp', {
  eager: true, query: '?url', import: 'default',
})
const portraitOnly = portraits['../../assets/portrait/rezwan-portrait-only.webp']
// The complete original artwork remains visible until both enhancement layers
// are ready, and for every static/failure tier. Never combine it with WebGL.
const fallbackSrc = legacyCompositeSrc

export function HeroPortrait() {
  const quality = useHaloQuality()
  if (quality !== 'static' && portraitOnly) {
    return <EnhancedPortrait key={quality} quality={quality} src={portraitOnly} />
  }
  return <FallbackPortrait />
}

function FallbackPortrait() {
  return (
    <img
      className="hero__portrait hero__portrait--composite"
      src={fallbackSrc}
      alt=""
      width="945"
      height="1020"
      draggable={false}
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />
  )
}

function EnhancedPortrait({ quality, src }: { quality: HaloQuality; src: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const [portraitReady, setPortraitReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const ready = canvasReady && portraitReady && !failed
  const onReady = useCallback(() => setCanvasReady(true), [])
  const onFailure = useCallback(() => setFailed(true), [])
  return (
    <div ref={host} className={`hero-artwork${ready ? ' hero-artwork--ready' : ''}${failed ? ' hero-artwork--failed' : ''}`} aria-hidden="true">
      <div className="hero-artwork__fallback"><FallbackPortrait /></div>
      {!failed && (
        <div className="hero-artwork__enhanced">
          <div className="hero-artwork__canvas">
            <HaloBoundary onFailure={onFailure}>
              <Suspense fallback={null}>
                <HaloCanvas host={host} quality={quality} onReady={onReady} onFailure={onFailure} />
              </Suspense>
            </HaloBoundary>
          </div>
          <img className="hero__portrait hero-artwork__foreground" src={src} alt="" width="899" height="1020"
            decoding="async" draggable={false} onError={onFailure}
            onLoad={(event) => { void event.currentTarget.decode().then(() => setPortraitReady(true), onFailure) }} />
        </div>
      )}
    </div>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei/core/MeshTransmissionMaterial'
import { Color, MathUtils, TorusGeometry } from 'three'
import type { Group } from 'three'
import type { HaloQuality } from './useHaloQuality'
import type { HeroPointer } from '../heroPointer'

type Props = {
  quality: HaloQuality
  pointer: RefObject<HeroPointer>
}

export function GlassHalo({ quality, pointer }: Props) {
  const group = useRef<Group>(null)
  const elapsed = useRef(0)
  const background = useMemo(() => new Color('#08060f'), [])
  const geometry = useMemo(() => {
    const torus = new TorusGeometry(1.63, 0.155, 16, 112)
    const positions = torus.attributes.position!
    // A subtle oval with uneven tube volume, rather than a perfectly machined donut.
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const angle = Math.atan2(y, x)
      const ripple = 1 + 0.025 * Math.sin(angle * 3 + 0.4)
      positions.setXYZ(i, x * ripple * 1.08, y * ripple, positions.getZ(i) * (1 + 0.1 * Math.cos(angle * 2)))
    }
    torus.computeVertexNormals()
    return torus
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    if (!group.current) return
    const dt = Math.min(delta, 0.05)
    elapsed.current += dt
    const t = elapsed.current
    // The same input/rest policy drives DOM parallax. Damping remains local
    // to the mesh; the GSAP entrance and scroll wrappers are never touched.
    const { x, y, influence } = pointer.current
    // Roughly matches the DOM quickTo settling time, independent of frame rate.
    // Idle drift quiets while actively tilting and as the next section arrives.
    const damping = 5
    const idle = influence * (1 - Math.min(1, Math.hypot(x, y)) * 0.7)
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, 1.1 + y * 0.23 + Math.sin(t * 0.16) * 0.04 * idle, damping, dt)
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, 0.12 + x * 0.32 + Math.sin(t * 0.12) * 0.06 * idle, damping, dt)
    group.current.rotation.z = MathUtils.damp(group.current.rotation.z, x * 0.07 + Math.sin(t * 0.1) * 0.02 * idle, damping, dt)
    group.current.position.x = MathUtils.damp(group.current.position.x, x * 0.045, damping, dt)
    group.current.position.y = MathUtils.damp(group.current.position.y, -0.05 - y * 0.035 + Math.sin(t * 0.2) * 0.008 * idle, damping, dt)
  })

  return (
    <group rotation={[0, 0, 0.56]}>
    <group ref={group} rotation={[1.1, 0.12, 0]} position={[0, -0.05, 0]}>
      <mesh geometry={geometry}>
        {quality === 'high' ? (
          <MeshTransmissionMaterial
            resolution={128} samples={4} backside={false}
            background={background} color="#c7abea" transmission={0.86}
            roughness={0.13} thickness={0.35} ior={1.46}
            chromaticAberration={0.018} anisotropicBlur={0.08}
            distortion={0.025} distortionScale={0.25} temporalDistortion={0}
            clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.7}
          />
        ) : (
          <meshPhysicalMaterial
            color="#6b40a2" metalness={0.3} roughness={0.2}
            clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.4}
          />
        )}
      </mesh>
    </group>
    </group>
  )
}

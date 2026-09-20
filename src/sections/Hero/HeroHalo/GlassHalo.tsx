import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei/core/MeshTransmissionMaterial'
import { Color, MathUtils, TorusGeometry } from 'three'
import type { Group } from 'three'
import type { HaloQuality } from './useHaloQuality'

type Props = {
  quality: HaloQuality
  pointer: RefObject<{ x: number; y: number; lastMove: number }>
}

export function GlassHalo({ quality, pointer }: Props) {
  const group = useRef<Group>(null)
  const elapsed = useRef(0)
  const measurement = useRef({ count: 0, seconds: 0 })
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
    // Frame-rate-independent damping ≈ 0.06 per frame at 60 Hz. After a brief
    // pointer rest, return gradually to the changing neutral orientation.
    const idleWeight = Math.max(0, 1 - Math.max(0, performance.now() - pointer.current.lastMove - 1200) / 2400)
    const x = pointer.current.x * idleWeight
    const y = pointer.current.y * idleWeight
    const damping = 3.7
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, 1.1 + y * 0.23 + Math.sin(t * 0.21) * 0.08, damping, dt)
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, 0.12 + x * 0.32 + Math.sin(t * 0.16) * 0.12, damping, dt)
    group.current.rotation.z = MathUtils.damp(group.current.rotation.z, x * 0.07 + Math.sin(t * 0.13) * 0.035, damping, dt)
    group.current.position.x = MathUtils.damp(group.current.position.x, x * 0.045, damping, dt)
    group.current.position.y = MathUtils.damp(group.current.position.y, -0.05 - y * 0.035 + Math.sin(t * 0.28) * 0.018, damping, dt)
    measurement.current.count++
    measurement.current.seconds += delta
    if (measurement.current.seconds >= 2) {
      const output = document.getElementById('halo-metrics')
      if (output) output.textContent = JSON.stringify({ fps: measurement.current.count / measurement.current.seconds, rotation: group.current.rotation.toArray(), pointer: pointer.current, frames: t, quality })
      measurement.current = { count: 0, seconds: 0 }
    }
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

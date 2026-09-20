import { Environment } from '@react-three/drei/core/Environment'
import { Lightformer } from '@react-three/drei/core/Lightformer'

/** A small, one-shot studio environment: no HDR download or live cube capture. */
export function HaloLighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} color="#d1c3ff" intensity={2} />
      <Environment resolution={64} frames={1}>
        <color attach="background" args={['#090711']} />
        <Lightformer position={[-3, 3, 4]} scale={[1.2, 5, 1]} color="#ece6ff" intensity={4} target={[0, 0, 0]} />
        <Lightformer position={[4, 1, 2]} scale={[2, 4, 1]} color="#8b3cff" intensity={5} target={[0, 0, 0]} />
        <Lightformer position={[-2, -3, 1]} scale={[3, 0.5, 1]} color="#9683ff" intensity={3} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}

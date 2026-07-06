import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function MembraneMesh() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!ref.current) return;

    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.35) * 0.18;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.03);
  });

  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.2, 2.4, 3]} intensity={3.2} />
      <pointLight position={[-2, -1, 2.2]} intensity={1.1} />

      <mesh ref={ref}>
        <icosahedronGeometry args={[1.35, 5]} />
        <meshStandardMaterial
          color="#d8d0ff"
          emissive="#28193d"
          emissiveIntensity={0.6}
          metalness={0.24}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}

export function Scene01IridescentMembrane() {
  return <MembraneMesh />;
}

export default Scene01IridescentMembrane;

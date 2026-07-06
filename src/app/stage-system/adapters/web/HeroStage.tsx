import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene01IridescentMembrane from "../../scenes/scene-01-iridescent-membrane/Scene01IridescentMembrane";

export default function HeroStage() {
  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    return (
      <div className="hero-poster-fallback">
        <div className="hero-poster-orb" />
        <div className="hero-poster-label">Scene 01 / poster fallback</div>
      </div>
    );
  }

  return (
    <div className="hero-canvas-shell">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene01IridescentMembrane />
        </Suspense>
      </Canvas>
    </div>
  );
}

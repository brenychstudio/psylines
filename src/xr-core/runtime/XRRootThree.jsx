import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import {
  makeDotTexture,
  makeRadialGradientTexture,
  makeVerticalHazeTexture,
} from "./helpers/xrTextureHelpers.js";

export default function XRRootThree({ manifest, options, xrSupported }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options?.quality?.maxDpr ?? 1.4));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.xr.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x04050a, 1);
    host.appendChild(renderer.domElement);

    let vrButton = null;
    if (xrSupported) {
      vrButton = VRButton.createButton(renderer);
      vrButton.id = "VRButton";
      host.appendChild(vrButton);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04050a);
    scene.fog = new THREE.Fog(0x04050a, 3.5, 22);

    const camera = new THREE.PerspectiveCamera(
      55,
      host.clientWidth / host.clientHeight,
      0.01,
      80
    );

    const player = new THREE.Group();
    player.position.set(0, 0, 4.2);
    scene.add(player);

    const yawObject = new THREE.Group();
    player.add(yawObject);

    const pitchObject = new THREE.Group();
    pitchObject.position.set(0, 1.62, 0);
    yawObject.add(pitchObject);
    pitchObject.add(camera);

    const ambient = new THREE.AmbientLight(0xc8d3ff, 0.22);
    scene.add(ambient);

    const rim = new THREE.DirectionalLight(0xb7c5ff, 0.34);
    rim.position.set(2.2, 3.1, 2.8);
    scene.add(rim);

    const greenFill = new THREE.DirectionalLight(0x89b56f, 0.1);
    greenFill.position.set(-2.5, 1.4, 1.2);
    scene.add(greenFill);

    const world = new THREE.Group();
    scene.add(world);

    const fieldGroup = new THREE.Group();
    world.add(fieldGroup);

    const signalGroup = new THREE.Group();
    world.add(signalGroup);

    const manifestationGroup = new THREE.Group();
    manifestationGroup.position.set(0, 1.58, -1.9);
    world.add(manifestationGroup);

    const residueGroup = new THREE.Group();
    residueGroup.position.set(0, 1.58, -2.35);
    world.add(residueGroup);

    const floorGroup = new THREE.Group();
    world.add(floorGroup);

    const floorDisc = new THREE.Mesh(
      new THREE.CircleGeometry(9.5, 100),
      new THREE.MeshBasicMaterial({
        color: 0x090c13,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      })
    );
    floorDisc.rotation.x = -Math.PI / 2;
    floorDisc.position.set(0, 0.01, -1.6);
    floorGroup.add(floorDisc);

    const floorRingMaterial = new THREE.LineBasicMaterial({
      color: 0x7f96cf,
      transparent: true,
      opacity: 0.16,
    });

    for (let i = 0; i < 6; i++) {
      const radius = 0.8 + i * 0.72;
      const points = [];
      for (let s = 0; s <= 90; s++) {
        const a = (s / 90) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0.02, Math.sin(a) * radius));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.LineLoop(geometry, floorRingMaterial.clone());
      ring.position.set(0, 0, -1.6);
      floorGroup.add(ring);
    }

    const radialTex = makeRadialGradientTexture(1024);
    if (radialTex) {
      const backAura = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({
          map: radialTex,
          transparent: true,
          opacity: 0.07,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      backAura.position.set(0, 2.1, -5.0);
      fieldGroup.add(backAura);
    }

    const hazeTex = makeVerticalHazeTexture(320, 1400);
    if (hazeTex) {
      const hazeMaterial = new THREE.MeshBasicMaterial({
        map: hazeTex,
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const hazeLeft = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 8.5), hazeMaterial.clone());
      hazeLeft.position.set(-2.6, 2.1, -3.2);
      fieldGroup.add(hazeLeft);

      const hazeRight = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 8.5), hazeMaterial.clone());
      hazeRight.position.set(2.5, 2.1, -3.1);
      fieldGroup.add(hazeRight);
    }

    const dotTex = makeDotTexture();
    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      const y = 0.25 + Math.random() * 3.5;
      const spread = 0.55 + Math.random() * 0.5;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * spread - 1.8;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3 + 0] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = 0.65 + Math.random() * 1.15;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      map: dotTex || undefined,
      size: 0.05,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0xb8d0ff),
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    signalGroup.add(particles);

    const arcMaterial = new THREE.LineBasicMaterial({
      color: 0x90a8da,
      transparent: true,
      opacity: 0.075,
    });

    const arcGroup = new THREE.Group();
    signalGroup.add(arcGroup);

    for (let i = 0; i < 7; i++) {
      const radius = 1.5 + i * 0.65;
      const points = [];
      for (let s = 0; s <= 72; s++) {
        const a = (s / 72) * Math.PI * 1.2 + Math.PI * 0.9;
        const x = Math.cos(a) * radius;
        const y = 0.8 + i * 0.16 + Math.sin(a * 2.0) * 0.09;
        const z = Math.sin(a) * radius * 0.45 - 1.8;
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const arc = new THREE.Line(geometry, arcMaterial.clone());
      arc.rotation.y = i * 0.52;
      arcGroup.add(arc);
    }

    let coreMesh = null;
    let residueA = null;
    let glowPlane = null;

    const loader = new THREE.TextureLoader();
    const art = Array.isArray(manifest?.artworks) ? manifest.artworks[0] : null;

    if (art?.src) {
      loader.load(
        art.src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;

          const iw = texture.image?.width || 1200;
          const ih = texture.image?.height || 1600;
          const aspect = iw / ih;

          const h = 3.6;
          const w = h * aspect;

          coreMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              opacity: 0.7,
            })
          );
          manifestationGroup.add(coreMesh);

          residueA = new THREE.Mesh(
            new THREE.PlaneGeometry(w * 1.1, h * 1.1),
            new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              opacity: 0.038,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          );
          residueA.position.set(-0.22, 0.08, -0.9);
          residueA.rotation.y = -0.14;
          residueGroup.add(residueA);

          glowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(w * 1.24, h * 1.24),
            new THREE.MeshBasicMaterial({
              color: 0x7fa36c,
              transparent: true,
              opacity: 0.052,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          );
          glowPlane.position.set(0, 0, -1.15);
          manifestationGroup.add(glowPlane);
        },
        undefined,
        (err) => {
          console.warn("ARTIST STAGE XR texture load failed:", err);
        }
      );
    }

    const keyState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      turnLeft: false,
      turnRight: false,
    };

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      console.log("XR keydown:", key);

      if (key === "w" || key === "arrowup") keyState.forward = true;
      if (key === "s" || key === "arrowdown") keyState.backward = true;
      if (key === "a" || key === "arrowleft") keyState.left = true;
      if (key === "d" || key === "arrowright") keyState.right = true;
      if (key === "q") keyState.turnLeft = true;
      if (key === "e") keyState.turnRight = true;
    };

    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w" || key === "arrowup") keyState.forward = false;
      if (key === "s" || key === "arrowdown") keyState.backward = false;
      if (key === "a" || key === "arrowleft") keyState.left = false;
      if (key === "d" || key === "arrowright") keyState.right = false;
      if (key === "q") keyState.turnLeft = false;
      if (key === "e") keyState.turnRight = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let dwell = 0;
    let proximity = 0;

    let isPointerLocked = false;
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;

    const onPointerMove = (event) => {
      if (!isPointerLocked) return;

      const sensitivity = 0.00115;
      targetYaw -= event.movementX * sensitivity;
      targetPitch -= event.movementY * sensitivity;

      const maxPitch = Math.PI / 2.4;
      targetPitch = THREE.MathUtils.clamp(targetPitch, -maxPitch, maxPitch);

      proximity = 1;
      dwell = Math.min(1, dwell + 0.02);
    };

    const onPointerDown = () => {
      if (document.pointerLockElement !== host) {
        host.requestPointerLock?.();
      }
    };

    const onPointerLockChange = () => {
      isPointerLocked = document.pointerLockElement === host;
    };

    host.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("mousemove", onPointerMove);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let reveal = 0;
    let introGate = 0;
    let cuePulse = 0;

    const onResize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    const forwardVec = new THREE.Vector3();
    const rightVec = new THREE.Vector3();
    const artWorldPosition = new THREE.Vector3(0, 1.58, -1.9);

    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.033);
      elapsed += dt;
      const t = elapsed;
      const dx = player.position.x - artWorldPosition.x;
      const dz = player.position.z - artWorldPosition.z;
      const planarDistance = Math.sqrt(dx * dx + dz * dz);
      const nearField = 1 - THREE.MathUtils.clamp((planarDistance - 1.1) / 3.8, 0, 1);
      introGate = Math.min(1, introGate + dt * 0.11);
      reveal = Math.min(1, Math.max(0, introGate - 0.22) / 0.78);
      cuePulse += dt;

      const introEase = THREE.MathUtils.smoothstep(introGate, 0, 1);
      const revealEase = THREE.MathUtils.smoothstep(reveal, 0, 1);
      const cueEase = 0.5 + Math.sin(cuePulse * 0.42) * 0.5;

      dwell += (0 - dwell) * 0.012;
      proximity += (0 - proximity) * 0.03;

      const rotateSpeed = 1.9;
      if (keyState.turnLeft) targetYaw += rotateSpeed * dt;
      if (keyState.turnRight) targetYaw -= rotateSpeed * dt;

      const moveSpeed = 3.8;
      forwardVec.set(0, 0, -1).applyQuaternion(yawObject.quaternion);
      rightVec.set(1, 0, 0).applyQuaternion(yawObject.quaternion);

      const moveInput = new THREE.Vector3();

      if (keyState.forward) moveInput.add(forwardVec);
      if (keyState.backward) moveInput.sub(forwardVec);
      if (keyState.right) moveInput.add(rightVec);
      if (keyState.left) moveInput.sub(rightVec);

      if (!player.userData.velocity) {
        player.userData.velocity = new THREE.Vector3();
      }

      const velocity = player.userData.velocity;

      if (moveInput.lengthSq() > 0) {
        moveInput.normalize().multiplyScalar(moveSpeed);
        velocity.lerp(moveInput, 0.12);
      } else {
        velocity.lerp(new THREE.Vector3(0, 0, 0), 0.08);
      }

      player.position.addScaledVector(velocity, dt);
      player.position.y = 0;

      player.position.x = THREE.MathUtils.clamp(player.position.x, -10, 10);
      player.position.z = THREE.MathUtils.clamp(player.position.z, -2, 12);

      yaw += (targetYaw - yaw) * 0.12;
      pitch += (targetPitch - pitch) * 0.12;

      yawObject.rotation.y = yaw;
      pitchObject.rotation.x = pitch;

      const pos = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const baseX = basePositions[idx + 0];
        const baseY = basePositions[idx + 1];
        const baseZ = basePositions[idx + 2];
        const phase = phases[i];
        const amp = 0.035 * scales[i];

        pos[idx + 0] = baseX + Math.sin(t * 0.34 + phase) * amp;
        pos[idx + 1] = baseY + Math.cos(t * 0.42 + phase) * amp * 1.28;
        pos[idx + 2] = baseZ + Math.sin(t * 0.27 + phase) * amp * 0.82;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesMaterial.opacity = (0.012 + nearField * 0.05) * revealEase * (0.65 + cueEase * 0.35);
      signalGroup.rotation.y = t * 0.014;

      arcGroup.children.forEach((arc, i) => {
        arc.rotation.y += 0.00035 + i * 0.00003;
        arc.material.opacity =
          (0.004 + Math.sin(t * 0.38 + i) * 0.004 + nearField * 0.014) * revealEase * (0.7 + cueEase * 0.3);
      });

      floorGroup.children.forEach((item, i) => {
        if (item.material?.opacity !== undefined && i > 0) {
          item.material.opacity =
            (0.004 + Math.sin(t * 0.65 + i) * 0.008 + nearField * 0.012) * revealEase;
        }
      });

      manifestationGroup.rotation.y = Math.sin(t * 0.14) * 0.025 + nearField * 0.035;
      manifestationGroup.rotation.x = Math.sin(t * 0.09) * 0.01;
      manifestationGroup.position.z =
        -1.9 + Math.sin(t * 0.22) * 0.03 - (1 - revealEase) * 0.7 + nearField * 0.06;

      residueGroup.rotation.y = Math.sin(t * 0.11) * 0.02;
      residueGroup.position.z = -2.35 + Math.sin(t * 0.19) * 0.02 - (1 - revealEase) * 0.18;

      if (coreMesh) {
        coreMesh.material.opacity = 0.72 * revealEase;
        coreMesh.position.x = Math.sin(t * 0.24) * 0.012 + nearField * 0.045;
        coreMesh.position.y = Math.cos(t * 0.18) * 0.01;
        coreMesh.position.z = -(1 - revealEase) * 0.55;
        coreMesh.rotation.y = Math.sin(t * 0.16) * 0.018 + nearField * 0.05;
      }

      if (residueA) {
        residueA.material.opacity = (0.004 + nearField * 0.026) * revealEase;
        residueA.position.x = -0.22 - nearField * 0.09;
        residueA.position.y = 0.08 + Math.sin(t * 0.3) * 0.015;
        residueA.position.z = -0.9 - (1 - revealEase) * 0.22;
        residueA.rotation.y = -0.14 - nearField * 0.08;
      }

      if (glowPlane) {
        glowPlane.material.opacity = (0.003 + nearField * 0.03) * revealEase * (0.75 + cueEase * 0.25);
        glowPlane.scale.x = 0.94 + revealEase * 0.06 + nearField * 0.06;
        glowPlane.scale.y = 0.94 + revealEase * 0.06 + nearField * 0.04;
      }

      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      host.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("mousemove", onPointerMove);
      if (document.pointerLockElement === host) {
        document.exitPointerLock?.();
      }

      if (vrButton && vrButton.parentNode) {
        vrButton.parentNode.removeChild(vrButton);
      }

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose?.());
          } else {
            obj.material.dispose?.();
          }
        }
      });

      renderer.dispose();
    };
  }, [manifest, options, xrSupported]);

  return <div ref={hostRef} style={{ position: "relative", width: "100%", height: "100%" }} />;
}

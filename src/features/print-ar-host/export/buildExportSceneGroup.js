import * as THREE from "three";
// Runtime dependency kept in features/ for stability. Canonical scene config ownership stays with the module contract.
import { buildPrintSceneConfig } from "../buildPrintSceneConfig.js";

function isCanvasLike(source) {
  return (
    (typeof HTMLCanvasElement !== "undefined" && source instanceof HTMLCanvasElement) ||
    (typeof OffscreenCanvas !== "undefined" && source instanceof OffscreenCanvas)
  );
}

function isBitmapLike(source) {
  return typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap;
}

function isImageLike(source) {
  return (
    (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) ||
    isBitmapLike(source)
  );
}

function loadTexture(source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      resolve(null);
      return;
    }

    if (isCanvasLike(source)) {
      const texture = new THREE.CanvasTexture(source);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      resolve(texture);
      return;
    }

    if (isImageLike(source)) {
      const texture = new THREE.Texture(source);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      resolve(texture);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      source,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

function track(disposables, resource) {
  if (resource?.dispose) {
    disposables.push(resource);
  }
  return resource;
}

function createDrawingCanvas(size) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(size, size);
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  return null;
}

function seededNoise(x, y, seed = 0) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function createSurfaceTexture({
  disposables,
  kind = "paper",
  colorHex = "#ffffff",
  size = 192,
  bump = false,
  repeatX = 1,
  repeatY = 1,
}) {
  const canvas = createDrawingCanvas(size);
  const context = canvas?.getContext?.("2d", { willReadFrequently: true });
  if (!canvas || !context) return null;

  const baseColor = new THREE.Color(colorHex);
  const base = {
    r: baseColor.r * 255,
    g: baseColor.g * 255,
    b: baseColor.b * 255,
  };
  const imageData = context.createImageData(size, size);
  const pixels = imageData.data;
  const isOak = kind === "oak";
  const isBlackFrame = kind === "black-frame";
  const isMat = kind === "mat";
  const isArtwork = kind === "artwork";

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const n = seededNoise(x, y, kind.length);
      const fine = seededNoise(x * 2.7, y * 2.1, kind.length + 11);
      const grain =
        Math.sin(y * 0.13 + seededNoise(Math.floor(x / 9), Math.floor(y / 17), 3) * 4.2) *
          0.5 +
        0.5;
      const fibre =
        Math.sin((isOak ? y : x + y) * 0.045 + seededNoise(x, Math.floor(y / 8), 8) * 2.6) *
          0.5 +
        0.5;

      if (bump) {
        const bumpStrength = isOak ? 44 : isArtwork ? 18 : isMat ? 12 : isBlackFrame ? 10 : 14;
        const value =
          128 +
          (n - 0.5) * bumpStrength +
          (fine - 0.5) * (bumpStrength * 0.54) +
          (isOak ? (grain - 0.5) * 34 : (fibre - 0.5) * 8);

        pixels[i] = clampChannel(value);
        pixels[i + 1] = clampChannel(value);
        pixels[i + 2] = clampChannel(value);
        pixels[i + 3] = 255;
        continue;
      }

      const variation = isOak
        ? (grain - 0.5) * 28 + (fine - 0.5) * 12
        : isBlackFrame
          ? (n - 0.5) * 5 + (fibre - 0.5) * 3
          : isMat
            ? (n - 0.5) * 7 + (fibre - 0.5) * 4
            : (n - 0.5) * 8 + (fine - 0.5) * 5;

      const warmth = isOak ? grain * 10 : isMat ? fibre * 3 : 0;
      pixels[i] = clampChannel(base.r + variation + warmth);
      pixels[i + 1] = clampChannel(base.g + variation + warmth * 0.62);
      pixels[i + 2] = clampChannel(base.b + variation - (isOak ? grain * 7 : 0));
      pixels[i + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  const texture = track(disposables, new THREE.CanvasTexture(canvas));
  texture.colorSpace = bump ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function resolveMaterialPreset(options = {}) {
  const preset = options.materialPreset || {};
  const appearance = options.appearance || {};

  return {
    artwork: {
      roughness: preset.artwork?.roughness ?? 0.98,
      metalness: preset.artwork?.metalness ?? 0,
      unlit: preset.artwork?.unlit ?? appearance.useArtworkUnlit ?? true,
    },
    paper: {
      roughness: preset.paper?.roughness ?? 0.99,
      metalness: preset.paper?.metalness ?? 0,
    },
    mat: {
      roughness: preset.mat?.roughness ?? 0.99,
      metalness: preset.mat?.metalness ?? 0,
    },
    frame: {
      roughness: preset.frame?.roughness ?? 0.9,
      metalness: preset.frame?.metalness ?? 0.016,
      clearcoat: preset.frame?.clearcoat ?? 0.03,
      clearcoatRoughness: preset.frame?.clearcoatRoughness ?? 0.96,
    },
  };
}

function createFrameRailMesh({
  length,
  thickness,
  depth,
  orientation = "horizontal",
  faceMaterial,
  sideMaterial,
  bevelSize = 0,
}) {
  const width = orientation === "horizontal" ? length : thickness;
  const height = orientation === "horizontal" ? thickness : length;
  const maxBevel = Math.max(Math.min(width, height, depth) * 0.22, 0);
  const resolvedBevel = Math.min(Math.max(bevelSize, 0), maxBevel);
  let geometry;
  let materials;

  if (resolvedBevel > 0.00001) {
    const shape = new THREE.Shape();
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    shape.moveTo(-halfWidth, -halfHeight);
    shape.lineTo(halfWidth, -halfHeight);
    shape.lineTo(halfWidth, halfHeight);
    shape.lineTo(-halfWidth, halfHeight);
    shape.lineTo(-halfWidth, -halfHeight);

    geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: resolvedBevel,
      bevelThickness: resolvedBevel * 0.78,
      curveSegments: 1,
      steps: 1,
    });
    geometry.center();
    materials = [faceMaterial, sideMaterial];
  } else {
    geometry = new THREE.BoxGeometry(width, height, depth);
    materials = [
      sideMaterial, // +X
      sideMaterial, // -X
      sideMaterial, // +Y
      sideMaterial, // -Y
      faceMaterial, // +Z front
      sideMaterial, // -Z back
    ];
  }

  const mesh = new THREE.Mesh(geometry, materials);
  return { mesh, geometry };
}

function mixHexColors(colorA, colorB, amount = 0.5) {
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);
  return `#${a.lerp(b, amount).getHexString()}`;
}

function addShadowBand({
  group,
  disposables,
  width,
  height,
  x = 0,
  y = 0,
  z = 0,
  opacity = 0.12,
  color = "#000000",
}) {
  if (width <= 0 || height <= 0) return null;

  const geometry = track(disposables, new THREE.PlaneGeometry(width, height));
  const material = track(
    disposables,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData.part = "surface-shadow";
  group.add(mesh);
  return mesh;
}

function addLayerShadowFrame({
  group,
  disposables,
  outerWidth,
  outerHeight,
  innerWidth,
  innerHeight,
  z,
  opacity = 0.12,
  band = 0.006,
  x = 0,
  y = 0,
}) {
  const horizontalWidth = Math.min(innerWidth + band * 2, outerWidth);
  const verticalHeight = innerHeight;
  const halfInnerW = innerWidth / 2;
  const halfInnerH = innerHeight / 2;
  const halfBand = band / 2;

  addShadowBand({
    group,
    disposables,
    width: horizontalWidth,
    height: band,
    x,
    y: y + halfInnerH + halfBand,
    z,
    opacity,
  });
  addShadowBand({
    group,
    disposables,
    width: horizontalWidth,
    height: band,
    x,
    y: y - halfInnerH - halfBand,
    z,
    opacity: opacity * 0.82,
  });
  addShadowBand({
    group,
    disposables,
    width: band,
    height: verticalHeight,
    x: x - halfInnerW - halfBand,
    y,
    z,
    opacity: opacity * 0.72,
  });
  addShadowBand({
    group,
    disposables,
    width: band,
    height: verticalHeight,
    x: x + halfInnerW + halfBand,
    y,
    z,
    opacity: opacity * 0.88,
  });
}

export async function buildExportSceneGroup(payload, options = {}) {
  const config = buildPrintSceneConfig(payload);
  const isInteractivePreview = options.exportTarget === "interactive-preview";
  const includePreviewGlass = false;
  const textureSource = options.artworkTextureSource || config.artwork.imageUrl;
  const texture = await loadTexture(textureSource);
  const disposables = [];
  const materialPreset = resolveMaterialPreset({
    ...options,
    appearance: {
      ...(config.appearance?.export || {}),
      ...(isInteractivePreview ? config.appearance?.interactivePreview || {} : {}),
    },
  });

  if (texture) {
    texture.flipY = options.textureFlipY ?? false;
    texture.needsUpdate = true;
    track(disposables, texture);
  }

  const group = new THREE.Group();
  group.name = payload?.variantId || "print-preview";

  const scale = 0.001;
  const frameOuterWidth = config.frame.outerWidthMm * scale;
  const frameOuterHeight = config.frame.outerHeightMm * scale;
  const matOuterWidth = config.mat.outerWidthMm * scale;
  const matOuterHeight = config.mat.outerHeightMm * scale;
  const paperWidth = config.paper.widthMm * scale;
  const paperHeight = config.paper.heightMm * scale;
  const imageWidth = config.artwork.widthMm * scale;
  const imageHeight = config.artwork.heightMm * scale;
  const imageOffsetX = config.artwork.offsetXMm * scale;
  const imageOffsetY = config.artwork.offsetYMm * scale;
  const frameDepth = Math.max(config.frame.profileDepthMm * scale, 0.004);
  const matDepth = Math.max(config.mat.depthMm * scale, 0.0014);
  const paperDepth = Math.max(config.paper.depthMm * scale, 0.0012);

  if (config.frame.enabled) {
    const frameFaceColor = config.frame.faceColor || config.frame.color || "#26282d";
    const frameSideColor = config.frame.sideColor || frameFaceColor;
    const frameKind =
      config.frame.id === "oak" || config.frame.grainHint
        ? "oak"
        : config.frame.id === "white"
          ? "painted-white"
          : "black-frame";
    const frameSurfaceMap = isInteractivePreview && frameKind !== "black-frame"
      ? createSurfaceTexture({
          disposables,
          kind: frameKind,
          colorHex: frameFaceColor,
          repeatX: frameKind === "oak" ? 2.2 : 1.2,
          repeatY: frameKind === "oak" ? 5.8 : 3.4,
        })
      : null;
    const frameEnvIntensity =
      frameKind === "black-frame" ? 0.16 : frameKind === "oak" ? 0.5 : 0.38;
    const frameBumpMap = isInteractivePreview
      ? createSurfaceTexture({
          disposables,
          kind: frameKind,
          colorHex: frameFaceColor,
          bump: true,
          repeatX: frameKind === "oak" ? 2.2 : 1.2,
          repeatY: frameKind === "oak" ? 5.8 : 3.4,
        })
      : null;
    const sideSurfaceMap = isInteractivePreview && frameKind !== "black-frame"
      ? createSurfaceTexture({
          disposables,
          kind: frameKind,
          colorHex: frameSideColor,
          repeatX: frameKind === "oak" ? 1.7 : 1.1,
          repeatY: frameKind === "oak" ? 4.6 : 3,
        })
      : null;
    const sideBumpMap = isInteractivePreview
      ? createSurfaceTexture({
          disposables,
          kind: frameKind,
          colorHex: frameSideColor,
          bump: true,
          repeatX: frameKind === "oak" ? 1.7 : 1.1,
          repeatY: frameKind === "oak" ? 4.6 : 3,
        })
      : null;
    const faceMaterial = track(
      disposables,
      new THREE.MeshPhysicalMaterial({
        color: frameFaceColor,
        map: frameSurfaceMap,
        bumpMap: frameBumpMap,
        bumpScale: frameKind === "oak" ? 0.0011 : frameKind === "black-frame" ? 0.00016 : 0.00032,
        roughness: config.frame.roughness ?? materialPreset.frame.roughness,
        metalness: config.frame.metalness ?? materialPreset.frame.metalness,
        clearcoat: config.frame.clearcoat ?? materialPreset.frame.clearcoat,
        clearcoatRoughness:
          config.frame.clearcoatRoughness ?? materialPreset.frame.clearcoatRoughness,
        envMapIntensity: isInteractivePreview ? frameEnvIntensity : 1,
      }),
    );

    const sideMaterial = track(
      disposables,
      new THREE.MeshPhysicalMaterial({
        color: frameSideColor,
        map: sideSurfaceMap,
        bumpMap: sideBumpMap,
        bumpScale: frameKind === "oak" ? 0.0013 : frameKind === "black-frame" ? 0.00018 : 0.00038,
        roughness:
          config.frame.sideRoughness ??
          config.frame.roughness ??
          materialPreset.frame.roughness,
        metalness:
          config.frame.sideMetalness ??
          config.frame.metalness ??
          materialPreset.frame.metalness,
        clearcoat: Math.max(
          (config.frame.clearcoat ?? materialPreset.frame.clearcoat) * 0.45,
          0,
        ),
        clearcoatRoughness:
          config.frame.clearcoatRoughness ?? materialPreset.frame.clearcoatRoughness,
        envMapIntensity: isInteractivePreview ? frameEnvIntensity * 0.7 : 1,
      }),
    );

    const profileWidth = Math.max(config.frame.profileWidthMm * scale, 0.012);
    const railDepth = Math.max(config.frame.profileDepthMm * scale, 0.01);

    const horizontalRail = createFrameRailMesh({
      length: frameOuterWidth,
      thickness: profileWidth,
      depth: railDepth,
      orientation: "horizontal",
      faceMaterial,
      sideMaterial,
      bevelSize: isInteractivePreview ? Math.min(profileWidth, railDepth) * 0.025 : 0,
    });

    const verticalRail = createFrameRailMesh({
      length: frameOuterHeight,
      thickness: profileWidth,
      depth: railDepth,
      orientation: "vertical",
      faceMaterial,
      sideMaterial,
      bevelSize: isInteractivePreview ? Math.min(profileWidth, railDepth) * 0.025 : 0,
    });

    track(disposables, horizontalRail.geometry);
    track(disposables, verticalRail.geometry);

    const top = horizontalRail.mesh;
    const bottom = horizontalRail.mesh.clone();
    const left = verticalRail.mesh;
    const right = verticalRail.mesh.clone();

    const halfOuterW = frameOuterWidth / 2;
    const halfOuterH = frameOuterHeight / 2;
    const halfProfileW = profileWidth / 2;

    top.position.set(0, halfOuterH - halfProfileW, 0);
    bottom.position.set(0, -halfOuterH + halfProfileW, 0);
    left.position.set(-halfOuterW + halfProfileW, 0, 0);
    right.position.set(halfOuterW - halfProfileW, 0, 0);

    top.userData.part = "frame";
    bottom.userData.part = "frame";
    left.userData.part = "frame";
    right.userData.part = "frame";
    group.add(top, bottom, left, right);

    const lipInset = Math.max(
      (config.frame.innerLipInsetMm ?? 5.2) * scale,
      0.0035,
    );
    const lipWidth = Math.max(
      (config.frame.innerLipWidthMm ?? 2.8) * scale,
      0.0018,
    );
    const lipDepth = Math.max(
      Math.min((config.frame.innerLipDepthMm ?? 1.9) * scale, frameDepth * 0.42),
      0.0009,
    );

    const lipFaceColor = mixHexColors(frameFaceColor, frameSideColor, 0.72);
    const lipSideColor = mixHexColors(frameSideColor, "#0b0f14", 0.32);

    const lipFaceMaterial = track(
      disposables,
      new THREE.MeshPhysicalMaterial({
        color: lipFaceColor,
        map: frameSurfaceMap,
        bumpMap: frameBumpMap,
        bumpScale: frameKind === "oak" ? 0.0009 : frameKind === "black-frame" ? 0.00012 : 0.00025,
        roughness: Math.min(
          (config.frame.roughness ?? materialPreset.frame.roughness) + 0.04,
          1,
        ),
        metalness: config.frame.metalness ?? materialPreset.frame.metalness,
        clearcoat: Math.max(
          (config.frame.clearcoat ?? materialPreset.frame.clearcoat) * 0.35,
          0,
        ),
        clearcoatRoughness:
          config.frame.clearcoatRoughness ?? materialPreset.frame.clearcoatRoughness,
        envMapIntensity: isInteractivePreview ? frameEnvIntensity * 0.76 : 1,
      }),
    );

    const lipSideMaterial = track(
      disposables,
      new THREE.MeshPhysicalMaterial({
        color: lipSideColor,
        map: sideSurfaceMap,
        bumpMap: sideBumpMap,
        bumpScale: frameKind === "oak" ? 0.001 : frameKind === "black-frame" ? 0.00014 : 0.0003,
        roughness: Math.min(
          (config.frame.sideRoughness ??
            config.frame.roughness ??
            materialPreset.frame.roughness) + 0.05,
          1,
        ),
        metalness:
          config.frame.sideMetalness ??
          config.frame.metalness ??
          materialPreset.frame.metalness,
        clearcoat: Math.max(
          (config.frame.clearcoat ?? materialPreset.frame.clearcoat) * 0.2,
          0,
        ),
        clearcoatRoughness:
          config.frame.clearcoatRoughness ?? materialPreset.frame.clearcoatRoughness,
        envMapIntensity: isInteractivePreview ? frameEnvIntensity * 0.55 : 1,
      }),
    );

    const lipHorizontalRail = createFrameRailMesh({
      length: frameOuterWidth - lipInset * 2,
      thickness: lipWidth,
      depth: lipDepth,
      orientation: "horizontal",
      faceMaterial: lipFaceMaterial,
      sideMaterial: lipSideMaterial,
      bevelSize: isInteractivePreview ? Math.min(lipWidth, lipDepth) * 0.05 : 0,
    });

    const lipVerticalRail = createFrameRailMesh({
      length: frameOuterHeight - lipInset * 2,
      thickness: lipWidth,
      depth: lipDepth,
      orientation: "vertical",
      faceMaterial: lipFaceMaterial,
      sideMaterial: lipSideMaterial,
      bevelSize: isInteractivePreview ? Math.min(lipWidth, lipDepth) * 0.05 : 0,
    });

    track(disposables, lipHorizontalRail.geometry);
    track(disposables, lipVerticalRail.geometry);

    const lipTop = lipHorizontalRail.mesh;
    const lipBottom = lipHorizontalRail.mesh.clone();
    const lipLeft = lipVerticalRail.mesh;
    const lipRight = lipVerticalRail.mesh.clone();

    const lipZ = frameDepth / 2 - lipDepth / 2 - 0.00015;

    lipTop.position.set(0, halfOuterH - lipInset - lipWidth / 2, lipZ);
    lipBottom.position.set(0, -halfOuterH + lipInset + lipWidth / 2, lipZ);
    lipLeft.position.set(-halfOuterW + lipInset + lipWidth / 2, 0, lipZ);
    lipRight.position.set(halfOuterW - lipInset - lipWidth / 2, 0, lipZ);

    lipTop.userData.part = "frame";
    lipBottom.userData.part = "frame";
    lipLeft.userData.part = "frame";
    lipRight.userData.part = "frame";

    group.add(lipTop, lipBottom, lipLeft, lipRight);
  }

  if (config.mat.enabled) {
    const matSurfaceMap = isInteractivePreview
      ? createSurfaceTexture({
          disposables,
          kind: "mat",
          colorHex: config.mat.color,
          repeatX: 2.8,
          repeatY: 3.6,
        })
      : null;
    const matBumpMap = isInteractivePreview
      ? createSurfaceTexture({
          disposables,
          kind: "mat",
          colorHex: config.mat.color,
          bump: true,
          repeatX: 2.8,
          repeatY: 3.6,
        })
      : null;
    const matGeometry = track(
      disposables,
      new THREE.BoxGeometry(matOuterWidth, matOuterHeight, matDepth),
    );
    const matMaterial = track(
      disposables,
      new THREE.MeshPhysicalMaterial({
        color: config.mat.color,
        map: matSurfaceMap,
        bumpMap: matBumpMap,
        bumpScale: 0.00034,
        roughness: materialPreset.mat.roughness,
        metalness: materialPreset.mat.metalness,
        clearcoat: 0.015,
        clearcoatRoughness: 0.96,
        envMapIntensity: isInteractivePreview ? 0.18 : 1,
      }),
    );

    const matBoard = new THREE.Mesh(matGeometry, matMaterial);
    matBoard.position.set(0, 0, frameDepth / 2 - matDepth / 2);
    matBoard.userData.part = "mat";
    group.add(matBoard);

    if (isInteractivePreview) {
      addLayerShadowFrame({
        group,
        disposables,
        outerWidth: matOuterWidth,
        outerHeight: matOuterHeight,
        innerWidth: paperWidth,
        innerHeight: paperHeight,
        z: frameDepth / 2 + 0.00018,
        opacity: 0.1,
        band: 0.007,
      });
    }
  }

  const paperSurfaceMap = isInteractivePreview
    ? createSurfaceTexture({
        disposables,
        kind: "paper",
        colorHex: config.paper.color,
        repeatX: 2.2,
        repeatY: 3.2,
      })
    : null;
  const paperBumpMap = isInteractivePreview
    ? createSurfaceTexture({
        disposables,
        kind: "paper",
        colorHex: config.paper.color,
        bump: true,
        repeatX: 2.2,
        repeatY: 3.2,
      })
    : null;
  const paperGeometry = track(
    disposables,
    new THREE.BoxGeometry(paperWidth, paperHeight, paperDepth),
  );
  const paperMaterial = track(
    disposables,
    new THREE.MeshPhysicalMaterial({
      color: config.paper.color,
      map: paperSurfaceMap,
      bumpMap: paperBumpMap,
      bumpScale: 0.00028,
      roughness: materialPreset.paper.roughness,
      metalness: materialPreset.paper.metalness,
      clearcoat: 0.012,
      clearcoatRoughness: 0.98,
      envMapIntensity: isInteractivePreview ? 0.14 : 1,
    }),
  );
  const paperSheet = new THREE.Mesh(paperGeometry, paperMaterial);
  paperSheet.position.set(0, 0, frameDepth / 2 + matDepth / 2 + paperDepth / 2);
  paperSheet.userData.part = "paper";
  group.add(paperSheet);

  const paperFrontZ = frameDepth / 2 + matDepth / 2 + paperDepth;

  if (isInteractivePreview) {
    addLayerShadowFrame({
      group,
      disposables,
      outerWidth: paperWidth,
      outerHeight: paperHeight,
      innerWidth: imageWidth,
      innerHeight: imageHeight,
      x: imageOffsetX,
      y: imageOffsetY,
      z: paperFrontZ + 0.00008,
      opacity: 0.055,
      band: 0.0045,
    });
  }

  const artworkBumpMap = isInteractivePreview
    ? createSurfaceTexture({
        disposables,
        kind: "artwork",
        colorHex: "#8f8f8f",
        bump: true,
        repeatX: 2,
        repeatY: 2.8,
      })
    : null;
  const useArtworkUnlit = materialPreset.artwork.unlit;
  const artworkDepth = isInteractivePreview
    ? Math.max(config.artwork.depthMm * scale, 0.00055)
    : 0;
  const artGeometry = track(
    disposables,
    isInteractivePreview
      ? new THREE.BoxGeometry(imageWidth, imageHeight, artworkDepth)
      : new THREE.PlaneGeometry(imageWidth, imageHeight),
  );
  const artworkEdgeMaterial = isInteractivePreview
    ? track(
        disposables,
        new THREE.MeshStandardMaterial({
          color: "#d8d1c5",
          roughness: 0.96,
          metalness: 0,
        }),
      )
    : null;
  const artMaterial = track(
    disposables,
    useArtworkUnlit
      ? new THREE.MeshBasicMaterial({
          color: "#ffffff",
          map: texture || null,
          toneMapped: false,
        })
      : new THREE.MeshPhysicalMaterial({
          color: "#ffffff",
          map: texture || null,
          bumpMap: artworkBumpMap,
          bumpScale: 0.00046,
          roughness: materialPreset.artwork.roughness,
          metalness: materialPreset.artwork.metalness,
          clearcoat: isInteractivePreview ? 0.035 : 0,
          clearcoatRoughness: 0.84,
          emissive: isInteractivePreview ? new THREE.Color("#ffffff") : new THREE.Color("#000000"),
          emissiveMap: isInteractivePreview ? texture || null : null,
          emissiveIntensity: isInteractivePreview ? 0.008 : 0,
          envMapIntensity: isInteractivePreview ? 0.16 : 1,
        }),
  );
  const artMesh = new THREE.Mesh(
    artGeometry,
    isInteractivePreview && artworkEdgeMaterial
      ? [
          artworkEdgeMaterial,
          artworkEdgeMaterial,
          artworkEdgeMaterial,
          artworkEdgeMaterial,
          artMaterial,
          artworkEdgeMaterial,
        ]
      : artMaterial,
  );
  artMesh.position.set(
    imageOffsetX,
    imageOffsetY,
    paperFrontZ + artworkDepth / 2 + 0.00032,
  );
  artMesh.userData.part = "artwork";
  group.add(artMesh);

  if (includePreviewGlass && isInteractivePreview && config.frame.enabled) {
    const glassGeometry = track(
      disposables,
      new THREE.PlaneGeometry(matOuterWidth || paperWidth, matOuterHeight || paperHeight),
    );
    const glassMaterial = track(
      disposables,
      new THREE.MeshPhysicalMaterial({
        color: "#eef6f0",
        transparent: true,
        opacity: 0.058,
        roughness: 0.035,
        metalness: 0,
        transmission: 0.04,
        thickness: 0.002,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        depthWrite: false,
        envMapIntensity: 0.72,
        side: THREE.FrontSide,
      }),
    );
    const glassSheet = new THREE.Mesh(glassGeometry, glassMaterial);
    glassSheet.position.set(
      0,
      0,
      frameDepth / 2 + matDepth / 2 + paperDepth + 0.00155,
    );
    glassSheet.userData.part = "glass";
    group.add(glassSheet);
  }

  group.userData.printPreview = {
    productId: payload?.productId || "",
    variantId: payload?.variantId || "",
    title: payload?.title || "",
    paperWidthMm: config.paper.widthMm,
    paperHeightMm: config.paper.heightMm,
    exportTarget: options.exportTarget || "glb",
    exportHints: config.exportHints,
    frontAxis: config.exportHints?.preferredFrontAxis || "Z+",
    upAxis: config.exportHints?.preferredUpAxis || "Y",
  };

  group.updateMatrixWorld(true);

  return {
    group,
    dispose() {
      for (const resource of disposables) {
        resource.dispose();
      }
    },
  };
}

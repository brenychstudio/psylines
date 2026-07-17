import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type SeriesConstellationTone =
  | "warm"
  | "cold"
  | "blue"
  | "earth"
  | "neutral"
  | "ash"
  | "red"
  | "green";

export type SeriesConstellationSize = "hero" | "large" | "medium" | "small";

export type SeriesConstellationNode = {
  id: string;
  title: string;
  description: string;
  href: string;
  objectHref: string;
  coverSrc: string;
  coverSrcset: string;
  coverAlt: string;
  year: string;
  status: string;
  orientation: "portrait" | "landscape" | "square";
  tone: SeriesConstellationTone;
  size: SeriesConstellationSize;
  x: number;
  y: number;
  count: number;
  signal: string;
  atmosphereSlug: string;
  kind: "series" | "object";
};

type SeriesConstellationFieldProps = {
  nodes: SeriesConstellationNode[];
  mapWidth: number;
  mapHeight: number;
};

declare global {
  interface Window {
    ArtistStageAtmosphereOrchestrator?: {
      setTarget?: (slug: string, options?: { source?: string; immediate?: boolean }) => void;
    };
    ArtistStageCinematicTransition?: {
      navigate?: (link: HTMLAnchorElement) => void;
    };
  }
}

const HANDOFF_KEY = "artist-stage:series-constellation-handoff";
const RETURN_KEY = "artist-stage:series-constellation-return";

const toneTokens: Record<
  SeriesConstellationTone,
  {
    atmoA: string;
    atmoB: string;
    atmoC: string;
    accent: string;
    glowOpacity: string;
  }
> = {
  earth: {
    atmoA: "rgba(72, 88, 50, 0.58)",
    atmoB: "rgba(142, 130, 82, 0.28)",
    atmoC: "rgba(18, 28, 20, 0.94)",
    accent: "rgba(167, 190, 117, 0.44)",
    glowOpacity: "0.58",
  },
  blue: {
    atmoA: "rgba(34, 86, 104, 0.58)",
    atmoB: "rgba(78, 134, 156, 0.34)",
    atmoC: "rgba(9, 24, 30, 0.95)",
    accent: "rgba(111, 180, 205, 0.46)",
    glowOpacity: "0.62",
  },
  ash: {
    atmoA: "rgba(94, 82, 68, 0.54)",
    atmoB: "rgba(174, 150, 112, 0.24)",
    atmoC: "rgba(22, 20, 18, 0.94)",
    accent: "rgba(202, 178, 138, 0.4)",
    glowOpacity: "0.5",
  },
  red: {
    atmoA: "rgba(104, 36, 32, 0.58)",
    atmoB: "rgba(204, 82, 62, 0.3)",
    atmoC: "rgba(30, 10, 9, 0.96)",
    accent: "rgba(214, 91, 72, 0.44)",
    glowOpacity: "0.6",
  },
  green: {
    atmoA: "rgba(48, 84, 42, 0.58)",
    atmoB: "rgba(126, 164, 82, 0.26)",
    atmoC: "rgba(12, 24, 14, 0.95)",
    accent: "rgba(150, 190, 92, 0.42)",
    glowOpacity: "0.55",
  },
  warm: {
    atmoA: "rgba(118, 76, 44, 0.56)",
    atmoB: "rgba(202, 122, 68, 0.3)",
    atmoC: "rgba(30, 18, 10, 0.95)",
    accent: "rgba(224, 150, 88, 0.44)",
    glowOpacity: "0.58",
  },
  cold: {
    atmoA: "rgba(40, 76, 78, 0.56)",
    atmoB: "rgba(88, 152, 146, 0.28)",
    atmoC: "rgba(8, 22, 24, 0.95)",
    accent: "rgba(122, 194, 186, 0.42)",
    glowOpacity: "0.58",
  },
  neutral: {
    atmoA: "rgba(72, 76, 66, 0.52)",
    atmoB: "rgba(150, 152, 130, 0.22)",
    atmoC: "rgba(16, 18, 16, 0.95)",
    accent: "rgba(198, 204, 178, 0.36)",
    glowOpacity: "0.46",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smootherstep(value: number) {
  const progress = clamp(value, 0, 1);
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

function getProximity(active: SeriesConstellationNode, node: SeriesConstellationNode) {
  const distance = Math.hypot(active.x - node.x, active.y - node.y);
  if (distance < 1) return "active";
  if (distance < 960) return "near";
  if (distance < 1680) return "mid";
  return "far";
}

function createNeuralPath(source: SeriesConstellationNode, target: SeriesConstellationNode, index: number) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const direction = index % 2 === 0 ? 1 : -1;
  const bend = clamp(distance * 0.16, 82, 250) * direction;
  const drift = Math.sin(index * 1.73) * 34;

  const c1x = source.x + dx * 0.34 + normalX * (bend + drift);
  const c1y = source.y + dy * 0.34 + normalY * (bend + drift);
  const c2x = source.x + dx * 0.68 - normalX * (bend * 0.72 - drift);
  const c2y = source.y + dy * 0.68 - normalY * (bend * 0.72 - drift);

  return `M ${source.x.toFixed(1)} ${source.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${target.x.toFixed(1)} ${target.y.toFixed(1)}`;
}

export default function SeriesConstellationField({
  nodes,
  mapWidth,
  mapHeight,
}: SeriesConstellationFieldProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [returnPulseId, setReturnPulseId] = useState("");
  const [selectedPulseId, setSelectedPulseId] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef(new Map<string, HTMLAnchorElement>());
  const targetPan = useRef({ x: 0, y: 0 });
  const currentPan = useRef({ x: 0, y: 0 });
  const activeIndexRef = useRef(0);
  const wheelAccumulator = useRef(0);
  const wheelCooldownUntil = useRef(0);
  const wheelResetTimer = useRef(0);
  const scrollHandoffTimer = useRef(0);
  const cameraMove = useRef({
    active: false,
    startTime: 0,
    duration: 0,
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
  });
  const dragState = useRef({
    active: false,
    started: false,
    suppressClick: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    nodeIndex: -1,
    openIntent: false,
  });
  const rafId = useRef(0);

  const activeNode = nodes[activeIndex] ?? nodes[0];

  const writeHandoff = useCallback((node: SeriesConstellationNode) => {
    try {
      const nodeElement = anchorRefs.current.get(node.id);
      const nodeImage = nodeElement?.querySelector("img");
      const fieldHost = document.querySelector("[data-series-webgl-backdrop]");
      const nodeStyle = nodeElement ? window.getComputedStyle(nodeElement) : null;
      const fieldStyle = fieldHost ? window.getComputedStyle(fieldHost) : null;
      const readColor = (...names: string[]) => {
        for (const style of [nodeStyle, fieldStyle]) {
          if (!style) continue;
          for (const name of names) {
            const value = style.getPropertyValue(name).trim();
            if (value) return value;
          }
        }
        return "";
      };

      window.sessionStorage.setItem(
        HANDOFF_KEY,
        JSON.stringify({
          source: "series-constellation",
          id: node.id,
          title: node.title,
          tone: node.tone,
          atmosphere: node.atmosphereSlug,
          href: node.href,
          coverSrc: nodeImage?.currentSrc || node.coverSrc,
          palette: {
            accent: readColor("--node-accent", "--series-pigment-a", "--series-accent"),
            wash: readColor("--series-pigment-b", "--series-atmo-b"),
            ink: readColor("--series-deep", "--series-atmo-c"),
          },
          map: {
            x: currentPan.current.x,
            y: currentPan.current.y,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
          },
          at: Date.now(),
        }),
      );
    } catch {
      // Progressive continuity only; normal links stay functional.
    }
  }, []);

  const readReturnTarget = useCallback(() => {
    try {
      const payload = window.sessionStorage.getItem(RETURN_KEY) || window.sessionStorage.getItem(HANDOFF_KEY);
      if (!payload) return null;
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }, []);

  const getBounds = useCallback(() => {
    const rect = fieldRef.current?.getBoundingClientRect();
    const width = rect?.width || 1;
    const height = rect?.height || 1;

    return {
      width,
      height,
      minX: Math.min(0, width - mapWidth),
      minY: Math.min(0, height - mapHeight),
      maxX: 0,
      maxY: 0,
    };
  }, [mapHeight, mapWidth]);

  const render = useCallback((timestamp = window.performance.now()) => {
    if (cameraMove.current.active) {
      const elapsed = timestamp - cameraMove.current.startTime;
      const progress = clamp(elapsed / cameraMove.current.duration, 0, 1);
      const eased = smootherstep(progress);

      currentPan.current.x =
        cameraMove.current.fromX + (cameraMove.current.toX - cameraMove.current.fromX) * eased;
      currentPan.current.y =
        cameraMove.current.fromY + (cameraMove.current.toY - cameraMove.current.fromY) * eased;

      if (progress >= 1) {
        cameraMove.current.active = false;
        currentPan.current.x = cameraMove.current.toX;
        currentPan.current.y = cameraMove.current.toY;
      }
    } else {
      currentPan.current.x += (targetPan.current.x - currentPan.current.x) * 0.14;
      currentPan.current.y += (targetPan.current.y - currentPan.current.y) * 0.14;
    }

    if (Math.abs(targetPan.current.x - currentPan.current.x) < 0.08) {
      currentPan.current.x = targetPan.current.x;
    }

    if (Math.abs(targetPan.current.y - currentPan.current.y) < 0.08) {
      currentPan.current.y = targetPan.current.y;
    }

    if (mapRef.current) {
      const x = currentPan.current.x;
      const y = currentPan.current.y;
      mapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rootRef.current?.style.setProperty("--series-pan-x", `${x.toFixed(2)}px`);
      rootRef.current?.style.setProperty("--series-pan-y", `${y.toFixed(2)}px`);
    }

    if (
      cameraMove.current.active ||
      currentPan.current.x !== targetPan.current.x ||
      currentPan.current.y !== targetPan.current.y
    ) {
      rafId.current = window.requestAnimationFrame(render);
    } else {
      rafId.current = 0;
    }
  }, []);

  const requestRender = useCallback(() => {
    if (!rafId.current) {
      rafId.current = window.requestAnimationFrame(render);
    }
  }, [render]);

  const startCinematicPan = useCallback(
    (toX: number, toY: number) => {
      const distance = Math.hypot(toX - currentPan.current.x, toY - currentPan.current.y);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reducedMotion ? 0 : clamp(1280 + distance * 0.32, 1500, 2300);

      if (reducedMotion) {
        cameraMove.current.active = false;
        currentPan.current.x = toX;
        currentPan.current.y = toY;
        targetPan.current.x = toX;
        targetPan.current.y = toY;
        requestRender();
        return 0;
      }

      cameraMove.current = {
        active: true,
        startTime: window.performance.now(),
        duration,
        fromX: currentPan.current.x,
        fromY: currentPan.current.y,
        toX,
        toY,
      };

      requestRender();
      return duration;
    },
    [requestRender],
  );

  const clampPan = useCallback(() => {
    const bounds = getBounds();
    targetPan.current.x = clamp(targetPan.current.x, bounds.minX, bounds.maxX);
    targetPan.current.y = clamp(targetPan.current.y, bounds.minY, bounds.maxY);
  }, [getBounds]);

  const panToNode = useCallback(
    (node: SeriesConstellationNode) => {
      const bounds = getBounds();
      const centerX = bounds.width < 760 ? 0.5 : 0.57;
      const centerY = bounds.width < 760 ? 0.5 : 0.5;

      targetPan.current.x = bounds.width * centerX - node.x;
      targetPan.current.y = bounds.height * centerY - node.y;
      clampPan();
      return startCinematicPan(targetPan.current.x, targetPan.current.y);
    },
    [clampPan, getBounds, startCinematicPan],
  );

  const setActiveNode = useCallback(
    (index: number, options: { pan?: boolean; pulse?: boolean; selected?: boolean } = {}) => {
      const nextIndex = (index + nodes.length) % nodes.length;
      const node = nodes[nextIndex];
      if (!node) return;

      if (scrollHandoffTimer.current) window.clearTimeout(scrollHandoffTimer.current);
      scrollHandoffTimer.current = 0;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      if (options.selected) {
        setSelectedPulseId(node.id);
        window.setTimeout(() => setSelectedPulseId(""), 760);
      }

      if (options.pulse) {
        setReturnPulseId(node.id);
        window.setTimeout(() => setReturnPulseId(""), 1100);
      }

      if (options.pan !== false) {
        panToNode(node);
      }
    },
    [nodes, panToNode],
  );

  const navigateByScroll = useCallback(
    (direction: number) => {
      const nextIndex = clamp(activeIndexRef.current + direction, 0, nodes.length - 1);
      if (nextIndex === activeIndexRef.current) return 0;

      const node = nodes[nextIndex];
      if (!node) return 0;

      activeIndexRef.current = nextIndex;
      if (scrollHandoffTimer.current) window.clearTimeout(scrollHandoffTimer.current);
      const duration = panToNode(node);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setActiveIndex(nextIndex);
        return 0;
      }

      const handoffDelay = clamp(duration * 0.78, 1050, 1600);
      scrollHandoffTimer.current = window.setTimeout(() => {
        scrollHandoffTimer.current = 0;
        setActiveIndex(nextIndex);
      }, handoffDelay);
      return duration;
    },
    [nodes, panToNode],
  );

  const openNode = useCallback(
    (node: SeriesConstellationNode) => {
      const anchor = anchorRefs.current.get(node.id);
      writeHandoff(node);

      if (anchor && window.ArtistStageCinematicTransition?.navigate) {
        window.ArtistStageCinematicTransition.navigate(anchor);
        return;
      }

      window.location.href = node.href;
    },
    [writeHandoff],
  );

  useEffect(() => {
    const returnState = readReturnTarget();
    const requestedId = returnState?.id || returnState?.slug || "";
    const requestedIndex = nodes.findIndex((node) => node.id === requestedId || node.title === requestedId);
    const storedMap = returnState?.map;
    const canRestorePan =
      requestedIndex >= 0 &&
      Number.isFinite(storedMap?.x) &&
      Number.isFinite(storedMap?.y) &&
      Math.abs(Number(storedMap?.viewportWidth || window.innerWidth) - window.innerWidth) < 240;

    setActiveNode(requestedIndex >= 0 ? requestedIndex : 0, {
      pan: !canRestorePan,
      pulse: requestedIndex >= 0,
    });

    if (canRestorePan) {
      targetPan.current.x = Number(storedMap.x);
      targetPan.current.y = Number(storedMap.y);
      clampPan();
      currentPan.current.x = targetPan.current.x;
      currentPan.current.y = targetPan.current.y;
      requestRender();
    }
  }, [clampPan, nodes, readReturnTarget, requestRender, setActiveNode]);

  useEffect(() => {
    const handleCinematicNavigation = (event: Event) => {
      const detail = (event as CustomEvent<{ fromPath?: string; toPath?: string; link?: Element }>).detail;
      if (detail?.fromPath !== "/series" || !detail.link || !rootRef.current?.contains(detail.link)) return;

      const destinationNode = nodes.find((node) => {
        try {
          return new URL(node.href, window.location.href).pathname === detail.toPath;
        } catch {
          return false;
        }
      });

      writeHandoff(destinationNode || activeNode);
    };

    window.addEventListener("artist-stage:cinematic-navigation-start", handleCinematicNavigation);
    return () => window.removeEventListener("artist-stage:cinematic-navigation-start", handleCinematicNavigation);
  }, [activeNode, nodes, writeHandoff]);

  useEffect(() => {
    if (!activeNode || !rootRef.current) return;

    const token = toneTokens[activeNode.tone] ?? toneTokens.neutral;
    rootRef.current.dataset.activeTone = activeNode.tone;
    rootRef.current.style.setProperty("--series-atmo-a", token.atmoA);
    rootRef.current.style.setProperty("--series-atmo-b", token.atmoB);
    rootRef.current.style.setProperty("--series-atmo-c", token.atmoC);
    rootRef.current.style.setProperty("--series-accent", token.accent);
    rootRef.current.style.setProperty("--series-glow-opacity", token.glowOpacity);
    rootRef.current.style.setProperty("--series-glow-x", `${(activeNode.x / mapWidth) * 100}%`);
    rootRef.current.style.setProperty("--series-glow-y", `${(activeNode.y / mapHeight) * 100}%`);

    const atmosphereOrchestrator = window.ArtistStageAtmosphereOrchestrator;

    if (atmosphereOrchestrator?.setTarget) {
      atmosphereOrchestrator.setTarget(activeNode.atmosphereSlug, {
        source: "series-constellation",
        immediate: false,
      });
    } else {
      window.dispatchEvent(
        new CustomEvent("artist-stage:artwork-atmosphere:set", {
          detail: {
            slug: activeNode.atmosphereSlug,
            source: "series-constellation",
          },
        }),
      );
    }

    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.href = activeNode.href;
    document.head.append(prefetch);

    return () => {
      prefetch.remove();
    };
  }, [activeNode, mapHeight, mapWidth]);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current);
      }
      if (wheelResetTimer.current) window.clearTimeout(wheelResetTimer.current);
      if (scrollHandoffTimer.current) window.clearTimeout(scrollHandoffTimer.current);
    };
  }, []);

  const neuralLinks = useMemo(() => {
    const active = nodes[activeIndex] ?? nodes[0];
    const seen = new Set<string>();
    const links: Array<{
      id: string;
      d: string;
      state: "active" | "latent";
      proximity: string;
      delay: string;
      opacity: string;
      width: string;
    }> = [];

    const addLink = (
      source: SeriesConstellationNode,
      target: SeriesConstellationNode,
      state: "active" | "latent",
      index: number,
    ) => {
      const key = [source.id, target.id].sort().join("__");
      if (seen.has(key)) return;
      seen.add(key);

      const proximity = active ? getProximity(active, target) : "mid";
      const distance = Math.hypot(source.x - target.x, source.y - target.y);
      const strength = state === "active" ? 1 : clamp(1 - distance / 2200, 0.18, 0.5);

      links.push({
        id: `${state}-${key}`,
        d: createNeuralPath(source, target, index),
        state,
        proximity,
        delay: `${(index * -0.74).toFixed(2)}s`,
        opacity: state === "active" ? "0.72" : strength.toFixed(2),
        width: state === "active" ? "1.35" : "0.72",
      });
    };

    if (active) {
      nodes.forEach((node, index) => {
        if (node.id !== active.id) addLink(active, node, "active", index);
      });
    }

    nodes.forEach((source, sourceIndex) => {
      nodes
        .filter((target) => target.id !== source.id)
        .sort((a, b) => Math.hypot(source.x - a.x, source.y - a.y) - Math.hypot(source.x - b.x, source.y - b.y))
        .slice(0, 2)
        .forEach((target, targetIndex) => {
          addLink(source, target, "latent", sourceIndex * 3 + targetIndex + 7);
        });
    });

    return links;
  }, [activeIndex, nodes]);

  const panByWheel = useCallback(
    (deltaXValue: number, deltaYValue: number, deltaMode = 0, shiftKey = false) => {
      const pageScale = fieldRef.current?.getBoundingClientRect().height || window.innerHeight;
      const modeScale = deltaMode === 1 ? 16 : deltaMode === 2 ? pageScale : 1;
      const normalizedX = deltaXValue * modeScale;
      const normalizedY = deltaYValue * modeScale;
      const verticalFocusGesture = !shiftKey && Math.abs(normalizedY) >= Math.abs(normalizedX) * 1.15;

      if (verticalFocusGesture) {
        const now = window.performance.now();
        if (wheelResetTimer.current) window.clearTimeout(wheelResetTimer.current);
        wheelResetTimer.current = window.setTimeout(() => {
          wheelAccumulator.current = 0;
          wheelResetTimer.current = 0;
        }, 260);

        if (now < wheelCooldownUntil.current) {
          wheelAccumulator.current = 0;
          return;
        }

        wheelAccumulator.current += normalizedY;
        if (Math.abs(wheelAccumulator.current) < 88) return;

        const direction = wheelAccumulator.current > 0 ? 1 : -1;
        wheelAccumulator.current = 0;
        const duration = navigateByScroll(direction);
        wheelCooldownUntil.current = now + Math.max(1850, duration + 160);
        return;
      }

      const deltaX = clamp(-normalizedX - normalizedY * 0.38, -72, 72);
      const deltaY = clamp(-normalizedY * 0.18 - normalizedX * 0.3, -34, 34);

      cameraMove.current.active = false;
      targetPan.current.x += deltaX;
      targetPan.current.y += deltaY;
      clampPan();
      requestRender();
    },
    [clampPan, navigateByScroll, requestRender],
  );

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const handleNativeWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 900) return;
      event.preventDefault();
      panByWheel(event.deltaX, event.deltaY, event.deltaMode, event.shiftKey);
    };

    field.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      field.removeEventListener("wheel", handleNativeWheel);
    };
  }, [panByWheel]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handlePanelWheel = (event: WheelEvent) => {
      if (
        window.innerWidth <= 900 ||
        fieldRef.current?.contains(event.target as Node | null)
      ) return;

      event.preventDefault();
      panByWheel(event.deltaX, event.deltaY, event.deltaMode, event.shiftKey);
    };

    root.addEventListener('wheel', handlePanelWheel, { passive: false });
    return () => root.removeEventListener('wheel', handlePanelWheel);
  }, [panByWheel]);

  const panByDrag = useCallback(
    (deltaX: number, deltaY: number) => {
      cameraMove.current.active = false;
      targetPan.current.x += deltaX;
      targetPan.current.y += deltaY;
      clampPan();
      requestRender();
    },
    [clampPan, requestRender],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    const target = event.target as HTMLElement;
    const nodeElement = target.closest<HTMLElement>("[data-series-node]");
    const nodeIndex = nodeElement?.dataset.seriesIndex ? Number(nodeElement.dataset.seriesIndex) : -1;
    const openIntent = Boolean(target.closest("[data-series-open-cta]"));

    event.preventDefault();

    dragState.current = {
      active: true,
      started: false,
      suppressClick: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: targetPan.current.x,
      originY: targetPan.current.y,
      nodeIndex: Number.isFinite(nodeIndex) ? nodeIndex : -1,
      openIntent,
    };

    fieldRef.current?.classList.add("is-grabbing");
    fieldRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    if (!dragState.current.started && Math.hypot(deltaX, deltaY) > 7) {
      dragState.current.started = true;
      dragState.current.suppressClick = true;
      rootRef.current?.classList.add("is-dragging-field");
    }

    if (!dragState.current.started) return;

    panByDrag(
      dragState.current.originX + deltaX - targetPan.current.x,
      dragState.current.originY + deltaY - targetPan.current.y,
    );
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const didDrag = dragState.current.started;
    const nodeIndex = dragState.current.nodeIndex;
    const openIntent = dragState.current.openIntent;

    dragState.current.active = false;
    fieldRef.current?.classList.remove("is-grabbing");
    rootRef.current?.classList.remove("is-dragging-field");
    fieldRef.current?.releasePointerCapture?.(event.pointerId);

    if (didDrag) {
      window.setTimeout(() => {
        dragState.current.suppressClick = false;
      }, 140);
      return;
    }

    const node = nodes[nodeIndex];
    if (!node) return;

    if (openIntent) {
      openNode(node);
      return;
    }

    setActiveNode(nodeIndex, { pan: true, selected: true });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveNode(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveNode(activeIndex + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      targetPan.current.y += 110;
      clampPan();
      requestRender();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      targetPan.current.y -= 110;
      clampPan();
      requestRender();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setActiveNode(0);
    }

    if (event.key === "Enter" && activeNode) {
      event.preventDefault();
      openNode(activeNode);
    }
  };

  if (!nodes.length || !activeNode) return null;

  return (
    <div
      ref={rootRef}
      className="series-constellation-page"
      data-series-constellation
      data-active-tone={activeNode.tone}
      data-active-artwork={activeNode.coverSrc}
      data-active-series-id={activeNode.id}
      data-works-atmosphere-field
      data-atmosphere-manual="true"
    >
      <div className="series-constellation__atmosphere" aria-hidden="true" />

      <section className="series-constellation-shell" aria-label="Series constellation field">
        <aside className="series-constellation-panel" aria-live="polite">
          <p className="series-constellation-kicker" data-cinematic-idle="detail">SERIES / LIVING CHAPTER MAP</p>
          <p className="series-constellation-signal" data-cinematic-idle="detail">{activeNode.signal}</p>
          <h1 data-cinematic-idle="anchor">{activeNode.title}</h1>
          <p className="series-constellation-description" data-cinematic-idle="voice">{activeNode.description}</p>

          <dl className="series-constellation-meta" data-cinematic-idle="line">
            <div>
              <dt>Status</dt>
              <dd>{activeNode.status}</dd>
            </div>
            <div>
              <dt>Years</dt>
              <dd>{activeNode.year}</dd>
            </div>
            <div>
              <dt>Works</dt>
              <dd>{activeNode.count}</dd>
            </div>
          </dl>

          <div className="series-constellation-controls" aria-label="Series field controls" data-cinematic-idle="action">
            <button type="button" onClick={() => setActiveNode(activeIndex - 1)}>
              Prev signal
            </button>
            <button type="button" onClick={() => setActiveNode(activeIndex + 1)}>
              Next signal
            </button>
            <button type="button" onClick={() => setActiveNode(0)}>
              Reset field
            </button>
          </div>

          <div className="series-constellation-actions" data-cinematic-idle="action">
            <button
              type="button"
              className="series-open-primary"
              onClick={() => openNode(activeNode)}
              data-atmosphere-handoff-slug={activeNode.atmosphereSlug}
            >
              {activeNode.kind === "series" ? "Open series" : "Open object"}
            </button>
            <a
              href={activeNode.objectHref}
              data-atmosphere-handoff-slug={activeNode.atmosphereSlug}
              data-cinematic-route-slug={activeNode.id}
            >
              Open object
            </a>
          </div>
        </aside>

        <div
          ref={fieldRef}
          className="series-constellation-viewport"
          tabIndex={0}
          role="application"
          aria-label="Drag the series field, use wheel to pan, or use arrow keys to navigate"
          data-series-field
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={() => {
            dragState.current.active = false;
            fieldRef.current?.classList.remove("is-grabbing");
            rootRef.current?.classList.remove("is-dragging-field");
          }}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={mapRef}
            className="series-constellation-map"
            style={
              {
                width: `${mapWidth}px`,
                height: `${mapHeight}px`,
              } as React.CSSProperties
            }
            data-series-map
            data-map-width={mapWidth}
            data-map-height={mapHeight}
          >
            <svg
              className="series-constellation-lines"
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              aria-hidden="true"
            >
              <defs>
                <filter id="seriesNeuralGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className="series-neural-web">
                {neuralLinks.map((link) => (
                  <g
                    key={link.id}
                    className="series-neural-link"
                    data-link-state={link.state}
                    data-link-proximity={link.proximity}
                    style={
                      {
                        "--link-delay": link.delay,
                        "--link-opacity": link.opacity,
                        "--link-width": link.width,
                      } as React.CSSProperties
                    }
                  >
                    <path className="series-neural-link__body" d={link.d} />
                    <path className="series-neural-link__signal" d={link.d} />
                  </g>
                ))}
              </g>

              <g className="series-neural-nodes">
                {nodes.map((node, index) => (
                  <circle
                    key={node.id}
                    className="series-neural-node"
                    data-node-state={index === activeIndex ? "active" : index === hoveredIndex ? "hovered" : "latent"}
                    cx={node.x}
                    cy={node.y}
                    r={index === activeIndex ? 8 : 4.5}
                  />
                ))}
              </g>
            </svg>

            {nodes.map((node, index) => {
              const isActive = index === activeIndex;
              const isHovered = index === hoveredIndex;
              const proximity = getProximity(activeNode, node);

              return (
                <a
                  key={node.id}
                  ref={(element) => {
                    if (element) anchorRefs.current.set(node.id, element);
                    else anchorRefs.current.delete(node.id);
                  }}
                  className={`series-constellation-node series-constellation-node--${node.size}${isActive ? " is-active" : ""}${isHovered ? " is-hovered" : ""}${returnPulseId === node.id ? " is-return-pulse" : ""}${selectedPulseId === node.id ? " is-selected-pulse" : ""}`}
                  href={node.href}
                  style={
                    {
                      "--node-x": `${node.x}px`,
                      "--node-y": `${node.y}px`,
                    } as React.CSSProperties
                  }
                  data-series-node
                  data-series-index={index}
                  data-series-id={node.id}
                  data-series-tone={node.tone}
                  data-series-signal={node.signal}
                  data-series-proximity={proximity}
                  data-series-hovered={isHovered ? "true" : "false"}
                  data-series-title={node.title}
                  data-series-description={node.description}
                  data-series-status={node.status}
                  data-series-years={node.year}
                  data-series-count={node.count}
                  data-series-href={node.href}
                  data-series-object-href={node.objectHref}
                  data-series-atmosphere={node.atmosphereSlug}
                  data-cinematic-route-slug={node.id}
                  data-cinematic-manual="true"
                  data-artwork-slug={node.atmosphereSlug}
                  data-atmosphere-handoff-slug={node.atmosphereSlug}
                  aria-current={isActive ? "true" : "false"}
                  aria-label={`Select ${node.title}`}
                  onPointerEnter={() => {
                    if (!dragState.current.active) setHoveredIndex(index);
                  }}
                  onPointerLeave={() => {
                    setHoveredIndex((current) => (current === index ? null : current));
                  }}
                  onFocus={() => setActiveNode(index)}
                  onClick={(event) => {
                    event.preventDefault();

                    if (event.detail !== 0) {
                      return;
                    }

                    setActiveNode(index, { pan: true, selected: true });
                  }}
                  onDragStart={(event) => event.preventDefault()}
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    openNode(node);
                  }}
                >
                  <figure>
                    {node.coverSrc ? (
                      <img
                        src={node.coverSrc}
                        srcSet={node.coverSrcset}
                        sizes="(min-width: 1200px) 34vw, (min-width: 700px) 48vw, 84vw"
                        alt={node.coverAlt}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                        data-cinematic-cover
                        data-cinematic-route-slug={node.id}
                        data-cinematic-idle={isActive ? "image" : undefined}
                      />
                    ) : (
                      <span className="series-constellation-empty" aria-hidden="true" />
                    )}
                    <span className="series-constellation-node__open" data-series-open-cta>
                      {node.kind === "series" ? "Open series" : "Open object"}
                    </span>
                  </figure>

                  <div className="series-constellation-node__caption" data-cinematic-idle={isActive ? "line" : "detail"}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{node.title}</strong>
                    <small>
                      {node.status} / {node.count} {node.count === 1 ? "work" : "works"}
                    </small>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="series-constellation-hints" aria-hidden="true">
            <span>Living field</span>
            <span>Signal drift</span>
            <span>Chapter route</span>
          </div>
        </div>
      </section>

      <section className="series-mobile-browser" aria-label="Series chapter browser">
        <div className="series-mobile-browser__head">
          <p className="series-constellation-kicker" data-cinematic-idle="detail">CHAPTER BROWSER</p>
          <h2 data-cinematic-idle="anchor">Chapter signals.</h2>
        </div>

        <div className="series-mobile-browser__rail">
          {nodes.map((node, index) => (
            <a
              key={node.id}
              className="series-mobile-card"
              href={node.href}
              data-atmosphere-handoff-slug={node.atmosphereSlug}
              data-cinematic-route-slug={node.id}
              onClick={() => writeHandoff(node)}
            >
              <img
                src={node.coverSrc}
                srcSet={node.coverSrcset}
                sizes="82vw"
                alt={node.coverAlt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                data-cinematic-cover
                data-cinematic-route-slug={node.id}
                data-cinematic-idle={index === activeIndex ? "image" : "trace"}
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong data-cinematic-idle="line">{node.title}</strong>
              <small data-cinematic-idle="detail">{node.signal}</small>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

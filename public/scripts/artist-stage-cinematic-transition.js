(() => {
  const TRANSITION_STORAGE_KEY = "artist-stage:cinematic-transition";
  const ACTIVE_ATTRIBUTE = "data-cinematic-transition";
  const MAX_PAYLOAD_AGE = 8000;
  const DEFAULT_TRANSITION = {
    leaveDuration: 300,
    arriveDuration: 920,
    peakVeilOpacity: 0.72,
    departureScale: 1.012,
  };
  const TRANSITION_PRESETS = {
    "series-chapter": {
      leaveDuration: 460,
      arriveDuration: 1280,
      peakVeilOpacity: 0.68,
      departureScale: 1.025,
    },
    "series-work": {
      leaveDuration: 380,
      arriveDuration: 1080,
      peakVeilOpacity: 0.76,
      departureScale: 1.016,
    },
    "series-return": {
      leaveDuration: 420,
      arriveDuration: 1160,
      peakVeilOpacity: 0.72,
      departureScale: 1.02,
    },
  };
  const COVER_SELECTOR = [
    "[data-cinematic-cover]",
    ".manifestation-entry__img",
    ".works-compact-image",
    ".home-selected-plane img",
    ".home-route-work img",
    ".series-chapter-flagship__surface img",
    ".series-selected-work img",
    ".object-chamber-media",
  ].join(", ");
  const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  let activeSourceElement = null;
  let isNavigating = false;
  let isArriving = false;

  const normalizeTransitionName = (slug) => {
    const safeSlug = String(slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return safeSlug ? `work-${safeSlug}` : "";
  };

  const isReducedMotion = () => Boolean(reducedMotionQuery?.matches);

  const supportsNativeRouteTransition = () =>
    Boolean(document.startViewTransition) &&
    Boolean(window.CSS?.supports?.("view-transition-name: root"));

  const safeReadPayload = () => {
    try {
      const raw = sessionStorage.getItem(TRANSITION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const safeWritePayload = (payload) => {
    try {
      sessionStorage.setItem(TRANSITION_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // The transition is decorative; normal navigation must keep working.
    }
  };

  const safeClearPayload = () => {
    try {
      sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
    } catch {
      // Ignore unavailable storage.
    }
  };

  const getSameOriginUrl = (href) => {
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin ? url : null;
    } catch {
      return null;
    }
  };

  const getRouteDataFromUrl = (url) => {
    const match = url.pathname.match(/^\/(works|series)\/([^/?#]+)\/?$/);
    if (!match) return null;

    return {
      routeType: match[1],
      slug: decodeURIComponent(match[2]),
    };
  };

  const getTransitionKind = (routeData, link) => {
    if (link?.dataset?.cinematicTransitionKind) {
      return link.dataset.cinematicTransitionKind;
    }

    const fromPath = window.location.pathname;

    if (/^\/series\/?$/.test(fromPath) && routeData.routeType === "series") {
      return "series-chapter";
    }

    if (/^\/series\/[^/]+\/?$/.test(fromPath) && routeData.routeType === "works") {
      return "series-work";
    }

    return "default";
  };

  const getTransitionPreset = (kind) => TRANSITION_PRESETS[kind] || DEFAULT_TRANSITION;

  const isCollectionIndexPath = (pathname) => /^\/(?:works|series)\/?$/.test(pathname || "");

  const getSourceElement = (link) => {
    const explicitSelector = link.dataset?.cinematicSourceSelector;

    if (explicitSelector) {
      try {
        const explicitSource = document.querySelector(explicitSelector);
        if (explicitSource) return explicitSource;
      } catch {
        // Invalid selectors should fall back to the local cover lookup.
      }
    }

    return link.querySelector(COVER_SELECTOR) || (link.matches("[data-cinematic-cover]") ? link : null);
  };

  const getElementImageSource = (element) => {
    if (element instanceof HTMLImageElement) {
      return element.currentSrc || element.src;
    }

    const image = element.querySelector?.("img");
    if (image) return image.currentSrc || image.src;

    return "";
  };

  const getPlainRect = (rect) => ({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  });

  const getDepartureRect = (rect, scale = DEFAULT_TRANSITION.departureScale) => ({
    left: rect.left - rect.width * (scale - 1) * 0.5,
    top: rect.top - rect.height * (scale - 1) * 0.5,
    width: rect.width * scale,
    height: rect.height * scale,
  });

  const readFirstCustomProperty = (styles, names) => {
    for (const style of styles) {
      if (!style) continue;
      for (const name of names) {
        const value = style.getPropertyValue(name).trim();
        if (value) return value;
      }
    }

    return "";
  };

  const getTransitionPalette = (sourceElement) => {
    const localOwner = sourceElement.closest?.(
      "[data-series-node], [data-artwork-slug], [data-object-chamber], [data-series-hero-frame]",
    );
    const seriesField = document.querySelector("[data-series-webgl-backdrop]");
    const styles = [
      localOwner ? window.getComputedStyle(localOwner) : null,
      window.getComputedStyle(sourceElement),
      seriesField ? window.getComputedStyle(seriesField) : null,
      window.getComputedStyle(document.documentElement),
    ];

    return {
      accent: readFirstCustomProperty(styles, ["--node-accent", "--series-pigment-a", "--work-accent", "--artwork-accent"]),
      wash: readFirstCustomProperty(styles, ["--series-pigment-b", "--work-wash", "--artwork-wash-strong", "--artwork-glow"]),
      ink: readFirstCustomProperty(styles, ["--series-deep", "--work-shadow", "--artwork-shadow-wash", "--atmo-bottom"]),
    };
  };

  const createBridgeLayer = ({
    src,
    alt = "",
    rect,
    objectFit = "contain",
    borderRadius = "0px",
    boxShadow = "",
    background = "",
    veilOpacity = 0,
    reusePreBridge = false,
    palette = null,
    transitionKind = "default",
  }) => {
    if (reusePreBridge) {
      const existingLayer = document.querySelector("[data-cinematic-prebridge]");
      const existingVeil = existingLayer?.querySelector?.(".cinematic-bridge-veil");
      const existingImage = existingLayer?.querySelector?.(".cinematic-bridge-image");

      if (existingLayer && existingVeil && existingImage) {
        existingLayer.removeAttribute("data-cinematic-prebridge");
        existingLayer.dataset.cinematicBridgeKind = transitionKind;
        if (palette?.accent) existingLayer.style.setProperty("--cinematic-bridge-accent", palette.accent);
        if (palette?.wash) existingLayer.style.setProperty("--cinematic-bridge-wash", palette.wash);
        if (palette?.ink) existingLayer.style.setProperty("--cinematic-bridge-ink", palette.ink);
        existingVeil.style.opacity = String(veilOpacity);
        existingImage.alt = alt;
        existingImage.decoding = "async";
        existingImage.src = src;
        existingImage.style.width = `${rect.width}px`;
        existingImage.style.height = `${rect.height}px`;
        existingImage.style.objectFit = objectFit || "contain";
        existingImage.style.borderRadius = borderRadius || "0px";
        existingImage.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
        existingImage.style.filter = "none";
        existingImage.style.mixBlendMode = "normal";
        if (boxShadow && boxShadow !== "none") existingImage.style.boxShadow = boxShadow;
        if (background && background !== "rgba(0, 0, 0, 0)") existingImage.style.background = background;

        return {
          layer: existingLayer,
          veil: existingVeil,
          image: existingImage,
        };
      }
    }

    const layer = document.createElement("div");
    layer.className = "cinematic-bridge-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.dataset.cinematicBridgeKind = transitionKind;
    if (palette?.accent) layer.style.setProperty("--cinematic-bridge-accent", palette.accent);
    if (palette?.wash) layer.style.setProperty("--cinematic-bridge-wash", palette.wash);
    if (palette?.ink) layer.style.setProperty("--cinematic-bridge-ink", palette.ink);

    const veil = document.createElement("div");
    veil.className = "cinematic-bridge-veil";
    veil.style.opacity = String(veilOpacity);

    const image = document.createElement("img");
    image.className = "cinematic-bridge-image";
    image.alt = alt;
    image.decoding = "async";
    image.src = src;
    image.style.width = `${rect.width}px`;
    image.style.height = `${rect.height}px`;
    image.style.objectFit = objectFit || "contain";
    image.style.borderRadius = borderRadius || "0px";
    image.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
    image.style.filter = "none";
    image.style.mixBlendMode = "normal";
    if (boxShadow && boxShadow !== "none") image.style.boxShadow = boxShadow;
    if (background && background !== "rgba(0, 0, 0, 0)") image.style.background = background;

    layer.append(veil, image);
    document.body.append(layer);

    return { layer, veil, image };
  };

  const animateBridgeImage = (image, fromRect, toRect, duration, easing) => {
    const scaleX = toRect.width ? fromRect.width / toRect.width : 1;
    const scaleY = toRect.height ? fromRect.height / toRect.height : 1;
    const fromTransform = `translate3d(${fromRect.left}px, ${fromRect.top}px, 0) scale(${scaleX}, ${scaleY})`;
    const toTransform = `translate3d(${toRect.left}px, ${toRect.top}px, 0) scale(1, 1)`;

    image.style.width = `${toRect.width}px`;
    image.style.height = `${toRect.height}px`;
    image.style.transform = fromTransform;

    return image.animate(
      [
        {
          transform: fromTransform,
          opacity: 1,
        },
        {
          transform: toTransform,
          opacity: 1,
        },
      ],
      {
        duration,
        easing,
        fill: "forwards",
      },
    );
  };

  const waitForImageReady = async (element, timeout = 420) => {
    const image = element instanceof HTMLImageElement ? element : element.querySelector?.("img");
    if (!image) return;

    try {
      if (image.decode) {
        await Promise.race([
          image.decode(),
          new Promise((resolve) => window.setTimeout(resolve, timeout)),
        ]);
      }
    } catch {
      // Decode failures should not block the route reveal.
    }
  };

  const shouldIgnoreClick = (event, link) =>
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.target === "_blank" ||
    link.hasAttribute("download") ||
    link.dataset.cinematicManual === "true";

  const resolveTransitionData = (link) => {
    const url = getSameOriginUrl(link.href);
    const routeData = url ? getRouteDataFromUrl(url) : null;
    if (!url || !routeData) return null;

    const sameDocumentHash =
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash;
    if (sameDocumentHash) return null;

    const sourceElement = getSourceElement(link);
    const slug =
      link.dataset.cinematicRouteSlug ||
      sourceElement?.dataset?.cinematicRouteSlug ||
      link.dataset.artworkSlug ||
      routeData.slug;
    const transitionName = normalizeTransitionName(slug);
    const sourceRect = sourceElement ? getPlainRect(sourceElement.getBoundingClientRect()) : null;
    const sourceSrc = sourceElement ? getElementImageSource(sourceElement) : "";
    const transitionKind = getTransitionKind(routeData, link);

    if (!slug || !transitionName || !sourceElement || !sourceRect || sourceRect.width < 8 || sourceRect.height < 8) {
      return null;
    }

    return {
      href: url.href,
      pathname: url.pathname,
      slug,
      routeType: routeData.routeType,
      transitionName,
      sourceElement,
      sourceRect,
      sourceSrc,
      alt: sourceElement instanceof HTMLImageElement ? sourceElement.alt : "",
      transitionKind,
      palette: getTransitionPalette(sourceElement),
    };
  };

  const announceNavigationStart = (link, data) => {
    window.dispatchEvent(new CustomEvent("artist-stage:cinematic-navigation-start", {
      detail: {
        href: data.href,
        fromPath: window.location.pathname,
        toPath: data.pathname,
        slug: data.slug,
        routeType: data.routeType,
        transitionKind: data.transitionKind,
        link,
        sourceElement: data.sourceElement,
      },
    }));
  };

  const prepareRouteHandoff = (link, pathname) => {
    const slug =
      link.dataset.atmosphereHandoffSlug ||
      link.closest?.("[data-atmosphere-handoff-slug]")?.dataset.atmosphereHandoffSlug ||
      link.dataset.artworkSlug ||
      undefined;

    window.ArtistStageAtmosphereOrchestrator?.prepareRouteHandoff?.(pathname, slug);
  };

  const startNativeNavigation = (link, data) => {
    safeClearPayload();
    announceNavigationStart(link, data);
    prepareRouteHandoff(link, data.pathname);

    data.sourceElement.style.viewTransitionName = data.transitionName;
    data.sourceElement.style.contain = data.sourceElement.style.contain || "layout paint";
    data.sourceElement.setAttribute("data-cinematic-native-source", "true");

    window.setTimeout(() => {
      data.sourceElement.removeAttribute("data-cinematic-native-source");
    }, 1800);
  };

  const startControlledNavigation = (event, link, data) => {
    if (isNavigating) return;
    isNavigating = true;

    announceNavigationStart(link, data);

    event.preventDefault();
    event.stopImmediatePropagation?.();

    if (isReducedMotion() || !data.sourceSrc || !("animate" in Element.prototype)) {
      safeWritePayload({
        mode: "fallback",
        href: data.href,
        slug: data.slug,
        routeType: data.routeType,
        transitionName: data.transitionName,
        transitionKind: data.transitionKind,
        palette: data.palette,
        at: Date.now(),
      });
      prepareRouteHandoff(link, data.pathname);
      window.location.href = data.href;
      return;
    }

    const computed = window.getComputedStyle(data.sourceElement);
    const preset = getTransitionPreset(data.transitionKind);
    const departureRect = getDepartureRect(data.sourceRect, preset.departureScale);
    const payload = {
      mode: "controlled-route",
      href: data.href,
      slug: data.slug,
      routeType: data.routeType,
      transitionName: data.transitionName,
      src: data.sourceSrc,
      alt: data.alt,
      sourceRect: departureRect,
      originRect: data.sourceRect,
      objectFit: computed.objectFit || "contain",
      borderRadius: computed.borderRadius || "0px",
      boxShadow: computed.boxShadow || "",
      background: computed.backgroundColor || "",
      transitionKind: data.transitionKind,
      palette: data.palette,
      leaveDuration: preset.leaveDuration,
      arriveDuration: preset.arriveDuration,
      peakVeilOpacity: preset.peakVeilOpacity,
      at: Date.now(),
    };

    safeWritePayload(payload);
    prepareRouteHandoff(link, data.pathname);

    document.documentElement.setAttribute(ACTIVE_ATTRIBUTE, "leaving");
    activeSourceElement = data.sourceElement;
    activeSourceElement.setAttribute("data-cinematic-cover-active", "true");

    const bridge = createBridgeLayer({
      src: payload.src,
      alt: payload.alt,
      rect: data.sourceRect,
      objectFit: payload.objectFit,
      borderRadius: payload.borderRadius,
      boxShadow: payload.boxShadow,
      background: payload.background,
      veilOpacity: 0,
      palette: payload.palette,
      transitionKind: payload.transitionKind,
    });

    bridge.veil.animate([{ opacity: 0 }, { opacity: preset.peakVeilOpacity }], {
      duration: preset.leaveDuration,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards",
    });

    animateBridgeImage(
      bridge.image,
      data.sourceRect,
      departureRect,
      preset.leaveDuration,
      "cubic-bezier(0.22, 0.72, 0.18, 1)",
    );

    window.setTimeout(() => {
      if (isNavigating) {
        window.location.href = data.href;
      }
    }, preset.leaveDuration);
  };

  const findArrivalTarget = (payload) => {
    const explicitTarget = [...document.querySelectorAll("[data-cinematic-arrival-slug]")].find((element) => {
      return element.dataset?.cinematicArrivalSlug === payload.slug;
    });

    if (explicitTarget) return explicitTarget;

    const slugTarget = [...document.querySelectorAll("[data-cinematic-cover]")].find((element) => {
      const routeSlug = element.dataset?.cinematicRouteSlug || element.closest?.("[data-cinematic-route-slug]")?.dataset?.cinematicRouteSlug;
      return routeSlug === payload.slug;
    });

    if (slugTarget) return slugTarget;

    const named = [...document.querySelectorAll("[data-cinematic-cover]")].find((element) => {
      const inlineName = element.style?.viewTransitionName;
      return inlineName === payload.transitionName;
    });

    if (named) return named;

    if (payload.routeType === "works") {
      return document.querySelector(".object-chamber-media[data-cinematic-cover]");
    }

    if (payload.routeType === "series") {
      return document.querySelector("[data-series-chapter-arrival-target], .series-hero-frame[data-slot='active'] [data-cinematic-cover]");
    }

    return null;
  };

  const clearHandoffVisualState = () => {
    delete document.documentElement.dataset.cinematicHandoffKind;
    document.documentElement.style.removeProperty("--cinematic-handoff-accent");
    document.documentElement.style.removeProperty("--cinematic-handoff-wash");
    document.documentElement.style.removeProperty("--cinematic-handoff-ink");
  };

  const revealFailedArrival = () => {
    safeClearPayload();
    document.documentElement.removeAttribute(ACTIVE_ATTRIBUTE);
    clearHandoffVisualState();
    isArriving = false;
    document.querySelectorAll("[data-cinematic-target-hidden]").forEach((element) => {
      element.removeAttribute("data-cinematic-target-hidden");
    });
  };

  const clearTransientTransitionState = ({ clearPayload = false } = {}) => {
    document.querySelectorAll(".cinematic-bridge-layer, [data-cinematic-prebridge]").forEach((element) => {
      element.remove();
    });

    document.querySelectorAll("[data-cinematic-cover-active], [data-cinematic-target-hidden], [data-cinematic-native-source]").forEach((element) => {
      element.removeAttribute("data-cinematic-cover-active");
      element.removeAttribute("data-cinematic-target-hidden");
      element.removeAttribute("data-cinematic-native-source");
      element.style.viewTransitionName = "";
    });

    activeSourceElement = null;
    isNavigating = false;
    isArriving = false;
    document.documentElement.removeAttribute(ACTIVE_ATTRIBUTE);
    clearHandoffVisualState();

    if (clearPayload) {
      safeClearPayload();
    }
  };

  const isBackForwardRestore = (event) => {
    if (event?.persisted) return true;
    const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
    return navigationEntry?.type === "back_forward";
  };

  const runArrivalBridge = async () => {
    if (isArriving) return;

    const payload = safeReadPayload();
    if (!payload) return;
    if (payload.mode !== "controlled-route") {
      safeClearPayload();
      return;
    }

    isArriving = true;

    const targetUrl = getSameOriginUrl(payload.href);
    const isFresh = Date.now() - Number(payload.at || 0) <= MAX_PAYLOAD_AGE;
    if (!targetUrl || targetUrl.pathname !== window.location.pathname || !isFresh || isReducedMotion()) {
      isArriving = false;
      revealFailedArrival();
      return;
    }

    if (isCollectionIndexPath(targetUrl.pathname)) {
      isArriving = false;
      revealFailedArrival();
      return;
    }

    const startRect = payload.sourceRect;
    if (!startRect || startRect.width < 8 || startRect.height < 8) {
      isArriving = false;
      revealFailedArrival();
      return;
    }

    const bridge = createBridgeLayer({
      src: payload.src,
      alt: payload.alt,
      rect: startRect,
      objectFit: payload.objectFit || "contain",
      borderRadius: payload.borderRadius || "0px",
      boxShadow: payload.boxShadow || "",
      background: payload.background || "",
      veilOpacity: Number(payload.peakVeilOpacity) || DEFAULT_TRANSITION.peakVeilOpacity,
      reusePreBridge: true,
      palette: payload.palette,
      transitionKind: payload.transitionKind || "default",
    });

    await waitForImageReady(bridge.image, 100);

    await new Promise((resolve) => window.requestAnimationFrame(resolve));

    const target = findArrivalTarget(payload);
    if (!target) {
      bridge.layer.remove();
      isArriving = false;
      revealFailedArrival();
      return;
    }

    target.setAttribute("data-cinematic-target-hidden", "true");
    await waitForImageReady(target, 140);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));

    const finalRect = getPlainRect(target.getBoundingClientRect());
    if (finalRect.width < 8 || finalRect.height < 8) {
      bridge.layer.remove();
      isArriving = false;
      revealFailedArrival();
      return;
    }

    const targetStyle = window.getComputedStyle(target);
    const arriveDuration = Number(payload.arriveDuration) || DEFAULT_TRANSITION.arriveDuration;
    const peakVeilOpacity = Number(payload.peakVeilOpacity) || DEFAULT_TRANSITION.peakVeilOpacity;
    bridge.image.style.objectFit = targetStyle.objectFit || payload.objectFit || "contain";
    bridge.image.style.borderRadius = targetStyle.borderRadius || payload.borderRadius || "0px";
    document.documentElement.setAttribute(ACTIVE_ATTRIBUTE, "arriving-active");

    window.dispatchEvent(new CustomEvent("artist-stage:cinematic-arrival-start", {
      detail: {
        slug: payload.slug,
        routeType: payload.routeType,
        transitionKind: payload.transitionKind || "default",
        target,
      },
    }));

    bridge.veil.animate([{ opacity: peakVeilOpacity }, { opacity: 0 }], {
      duration: Math.min(arriveDuration, 780),
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards",
    });

    const animation = animateBridgeImage(
      bridge.image,
      startRect,
      finalRect,
      arriveDuration,
      "cubic-bezier(0.16, 1, 0.3, 1)",
    );

    let hasFinished = false;
    const finishArrival = () => {
      if (hasFinished) return;
      hasFinished = true;

      target.removeAttribute("data-cinematic-target-hidden");

      window.requestAnimationFrame(() => {
        bridge.layer.remove();
        safeClearPayload();
        isArriving = false;
        document.documentElement.removeAttribute(ACTIVE_ATTRIBUTE);
        clearHandoffVisualState();
        window.dispatchEvent(new CustomEvent("artist-stage:cinematic-arrival-complete", {
          detail: {
            slug: payload.slug,
            routeType: payload.routeType,
            transitionKind: payload.transitionKind || "default",
            target,
          },
        }));
      });
    };
    const safetyTimer = window.setTimeout(finishArrival, arriveDuration + 420);

    animation.finished
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(safetyTimer);
        finishArrival();
      });
  };

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target?.closest?.("a[href]");
      if (!link || shouldIgnoreClick(event, link)) return;

      const data = resolveTransitionData(link);
      if (!data) return;

      if (!isReducedMotion() && link.dataset.cinematicNative === "true" && supportsNativeRouteTransition()) {
        startNativeNavigation(link, data);
        return;
      }

      startControlledNavigation(event, link, data);
    },
    { capture: true },
  );

  const navigate = (link) => {
    if (!link?.href || isNavigating) return;

    const data = resolveTransitionData(link);
    if (!data) {
      window.location.href = link.href;
      return;
    }

    startControlledNavigation(
      {
        preventDefault() {},
        stopImmediatePropagation() {},
      },
      link,
      data,
    );
  };

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
      clearTransientTransitionState();
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (isBackForwardRestore(event)) {
      clearTransientTransitionState({ clearPayload: true });
      return;
    }

    if (activeSourceElement) {
      activeSourceElement.removeAttribute("data-cinematic-cover-active");
      activeSourceElement = null;
    }

    const payload = safeReadPayload();
    if (payload?.mode === "controlled-route") {
      runArrivalBridge();
      return;
    }

    clearTransientTransitionState();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runArrivalBridge, { once: true });
  } else {
    runArrivalBridge();
  }

  window.ArtistStageCinematicTransition = {
    navigate,
    normalizeTransitionName,
    supportsNative: supportsNativeRouteTransition,
  };
})();

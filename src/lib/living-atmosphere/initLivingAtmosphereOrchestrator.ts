import {
  artworkAtmosphereProfiles,
  defaultArtworkAtmosphere,
  getArtworkAtmosphereProfile,
  type ArtworkAtmosphereProfile,
} from "../artwork-atmosphere/artworkAtmosphereProfiles";
import {
  defaultSectionAtmosphereState,
  getSectionAtmosphereState,
  type SectionAtmosphereState,
} from "./sectionAtmosphereStates";
import {
  readLastAtmosphereSlug,
  readRouteAtmosphereHandoff,
  writeRouteAtmosphereHandoff,
  type RouteAtmosphereHandoff,
} from "./routeAtmosphereMemory";
import {
  defaultPresenceAtmosphereState,
  getPresenceAtmosphereState,
  type PresenceAtmosphereState,
} from "./presenceAtmosphereState";
import {
  getArtworkPresenceCurve,
  type ArtworkPresenceCurve,
} from "./artworkPresenceCurves";

type AtmosphereInteractionState =
  | "settled"
  | "scrolling"
  | "focused"
  | "idle"
  | "inspecting"
  | "route-enter"
  | "route-leave";

type SetTargetOptions = {
  source?: string;
  immediate?: boolean;
};

type PresenceAtmosphereId = "active" | "settling" | "still" | "deep";

type PresenceDirectorPhase =
  | "awake"
  | "settling"
  | "contemplating"
  | "dreaming"
  | "waking";

type PendingAtmosphereSignal = {
  slug?: string;
  source?: string;
};

type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type LivingEnvironmentState = {
  cursorX: number;
  cursorY: number;
  targetCursorX: number;
  targetCursorY: number;
  focusX: number;
  focusY: number;
  targetFocusX: number;
  targetFocusY: number;
  fieldAX: number;
  fieldAY: number;
  fieldBX: number;
  fieldBY: number;
  fieldCX: number;
  fieldCY: number;
  activity: number;
  targetActivity: number;
  velocity: number;
  targetVelocity: number;
  pulseA: number;
  pulseB: number;
  proximity: number;
  driftX: number;
  driftY: number;
  counterDriftX: number;
  counterDriftY: number;
  hueRotate: number;
};

type OrchestratorApi = {
  setTarget: (slug: string, options?: SetTargetOptions) => void;
  setSection: (sectionId: string, options?: { source?: string; immediate?: boolean }) => void;
  setFocus: (slug: string, originElement?: HTMLElement) => void;
  clearFocus: () => void;
  setState: (state: AtmosphereInteractionState) => void;
  prepareRouteHandoff: (toPath?: string, slugOverride?: string) => void;
  setPresence: (
    presenceId: PresenceAtmosphereId,
    options?: { source?: string; immediate?: boolean },
  ) => void;
  getState: () => {
    targetSlug: string;
    currentSlug: string;
    previousRouteSlug: string;
    state: string;
    source: string;
    sectionId: string;
    sectionLabel: string;
    presenceId: string;
    presenceLabel: string;
    stillness: string;
    depth: string;
    calm: string;
    context: string;
    routeEnterRemaining: number;
    handoffSource: string;
    handoffFromPath: string;
    handoffToPath: string;
    presenceCurveSlug: string;
    presenceCurveLabel: string;
    presenceTemperament: string;
    psychologicalTension: string;
    psychologicalCalm: string;
    psychologicalDensity: string;
    psychologicalFocusPull: string;
    livingActivity: string;
    livingVelocity: string;
    livingCursor: string;
    livingFocus: string;
  };
};

declare global {
  interface Window {
    ArtistStageAtmosphereOrchestrator?: OrchestratorApi;
    __artistStagePendingArtworkAtmosphere?: PendingAtmosphereSignal;
  }
}

const PROFILE_DAMP_RATE = 1.15;
const WORK_DETAIL_PROFILE_DAMP_RATE = 1.55;
const SECTION_DAMP_RATE = 0.85;
const PRESENCE_DAMP_RATE = 1.05;
const PRESENCE_CURVE_RATE_SCALE = 20;
const ROUTE_ENTER_DURATION = 900;
const LAST_SLUG_STORAGE_KEY = "artist-stage:lastArtworkAtmosphereSlug";
const IDLE_DELAY = 3500;
const SCROLL_SETTLE_DELAY = 220;
const ACTIVITY_TIMER_THROTTLE_MS = 240;
const STYLE_FRAME_INTERVAL_MS = 1000 / 30;
const REDUCED_MOTION_STYLE_INTERVAL_MS = 180;
const SCROLL_ACTIVITY_THROTTLE_MS = 180;
const VIEWPORT_MIN_RATIO = 0.35;
const VIEWPORT_SWITCH_MARGIN = 0.1;
const SECTION_MIN_RATIO = 0.22;
const PRESENCE_SETTLING_MS = 1600;
const PRESENCE_STILL_MS = 3500;
const PRESENCE_DEEP_MS = 7000;
const WORK_DETAIL_HANDOFF_MS = 650;
const ENVIRONMENT_CURSOR_DAMP_RATE = 5.2;
const ENVIRONMENT_FOCUS_DAMP_RATE = 3.8;
const ENVIRONMENT_ACTIVITY_DAMP_RATE = 4.1;
const ENVIRONMENT_VELOCITY_DAMP_RATE = 6.2;
const ENVIRONMENT_DECAY = 0.935;
const ENVIRONMENT_VELOCITY_DECAY = 0.84;
const ENVIRONMENT_STYLE_INTERVAL_MS = STYLE_FRAME_INTERVAL_MS - 1;
const ENVIRONMENT_PRIORITY_STYLE_INTERVAL_MS = 24;
const POINTER_VELOCITY_SCALE = 10;
const POINTER_SAMPLE_INTERVAL_MS = 96;
const SCROLL_VELOCITY_SCALE = 0.008;

const rootStyleCache = new WeakMap<HTMLElement, Map<string, string>>();
const rootDatasetCache = new WeakMap<HTMLElement, Map<string, string>>();

function setRootStyleProperty(root: HTMLElement, property: string, value: string) {
  let cache = rootStyleCache.get(root);

  if (!cache) {
    cache = new Map<string, string>();
    rootStyleCache.set(root, cache);
  }

  if (cache.get(property) === value) return;

  cache.set(property, value);
  root.style.setProperty(property, value);
}

function setRootDatasetValue(root: HTMLElement, key: string, value: string) {
  let cache = rootDatasetCache.get(root);

  if (!cache) {
    cache = new Map<string, string>();
    rootDatasetCache.set(root, cache);
  }

  if (cache.get(key) === value) return;

  cache.set(key, value);
  root.dataset[key] = value;
}

function deleteRootDatasetValue(root: HTMLElement, key: string) {
  const cache = rootDatasetCache.get(root);

  if (cache?.get(key) === undefined && root.dataset[key] === undefined) return;

  cache?.delete(key);
  delete root.dataset[key];
}

function isKnownProfile(slug?: string) {
  if (!slug) return false;
  return slug === defaultArtworkAtmosphere.slug || Boolean(artworkAtmosphereProfiles[slug]);
}

function cloneProfile(profile: ArtworkAtmosphereProfile): ArtworkAtmosphereProfile {
  return { ...profile };
}

export function parseRgba(value: string): RgbaColor | null {
  const match = value
    .trim()
    .match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i);

  if (!match) return null;

  const [, r, g, b, a] = match;
  const color = {
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: Number(a),
  };

  return Object.values(color).every(Number.isFinite) ? color : null;
}

export function formatRgba(color: RgbaColor) {
  return `rgba(${Number(color.r.toFixed(2))}, ${Number(color.g.toFixed(2))}, ${Number(color.b.toFixed(2))}, ${Number(color.a.toFixed(4))})`;
}

export function lerpNumber(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getDampingAmount(rate: number, elapsedMs: number) {
  const deltaSeconds = Math.min(0.1, Math.max(0, elapsedMs / 1000));
  return 1 - Math.exp(-Math.max(0, rate) * deltaSeconds);
}

function clampNumber(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getPresenceIdForDirectorPhase(phase?: string): PresenceAtmosphereId {
  if (phase === "settling") return "settling";
  if (phase === "contemplating") return "still";
  if (phase === "dreaming") return "deep";
  return "active";
}

function toPercent(value: number) {
  return `${(clampNumber(value) * 100).toFixed(1)}%`;
}

function toPixels(value: number) {
  return `${value.toFixed(1)}px`;
}

function toDegrees(value: number) {
  return `${value.toFixed(1)}deg`;
}

function createLivingEnvironmentState(): LivingEnvironmentState {
  return {
    cursorX: 0.5,
    cursorY: 0.5,
    targetCursorX: 0.5,
    targetCursorY: 0.5,
    focusX: 0.5,
    focusY: 0.44,
    targetFocusX: 0.5,
    targetFocusY: 0.44,
    fieldAX: 0.34,
    fieldAY: 0.3,
    fieldBX: 0.68,
    fieldBY: 0.42,
    fieldCX: 0.48,
    fieldCY: 0.78,
    activity: 0,
    targetActivity: 0,
    velocity: 0,
    targetVelocity: 0,
    pulseA: 0.5,
    pulseB: 0.5,
    proximity: 0.5,
    driftX: 0,
    driftY: 0,
    counterDriftX: 0,
    counterDriftY: 0,
    hueRotate: 0,
  };
}

function getSlugSeed(slug?: string) {
  const value = slug || defaultArtworkAtmosphere.slug;
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 997;
  }

  return hash / 997;
}

function getElementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const width = window.innerWidth || document.documentElement.clientWidth || 1;
  const height = window.innerHeight || document.documentElement.clientHeight || 1;

  return {
    x: clampNumber((rect.left + rect.width / 2) / width),
    y: clampNumber((rect.top + rect.height / 2) / height),
  };
}

function syncLivingEnvironmentToRoot(root: HTMLElement, environment: LivingEnvironmentState) {
  setRootStyleProperty(root, "--living-cursor-x", toPercent(environment.cursorX));
  setRootStyleProperty(root, "--living-cursor-y", toPercent(environment.cursorY));
  setRootStyleProperty(root, "--living-focus-x", toPercent(environment.focusX));
  setRootStyleProperty(root, "--living-focus-y", toPercent(environment.focusY));
  setRootStyleProperty(root, "--living-field-x-a", toPercent(environment.fieldAX));
  setRootStyleProperty(root, "--living-field-y-a", toPercent(environment.fieldAY));
  setRootStyleProperty(root, "--living-field-x-b", toPercent(environment.fieldBX));
  setRootStyleProperty(root, "--living-field-y-b", toPercent(environment.fieldBY));
  setRootStyleProperty(root, "--living-field-x-c", toPercent(environment.fieldCX));
  setRootStyleProperty(root, "--living-field-y-c", toPercent(environment.fieldCY));
  setRootStyleProperty(root, "--living-activity", environment.activity.toFixed(2));
  setRootStyleProperty(root, "--living-velocity", environment.velocity.toFixed(2));
  setRootStyleProperty(root, "--living-pulse-a", environment.pulseA.toFixed(2));
  setRootStyleProperty(root, "--living-pulse-b", environment.pulseB.toFixed(2));
  setRootStyleProperty(root, "--living-proximity", environment.proximity.toFixed(2));
  setRootStyleProperty(root, "--living-drift-x", toPixels(environment.driftX));
  setRootStyleProperty(root, "--living-drift-y", toPixels(environment.driftY));
  setRootStyleProperty(root, "--living-counter-drift-x", toPixels(environment.counterDriftX));
  setRootStyleProperty(root, "--living-counter-drift-y", toPixels(environment.counterDriftY));
  setRootStyleProperty(root, "--living-hue-rotate", toDegrees(environment.hueRotate));
}

export function lerpColor(a: string, b: string, t: number) {
  const from = parseRgba(a);
  const to = parseRgba(b);

  if (!from || !to) return b;

  return formatRgba({
    r: lerpNumber(from.r, to.r, t),
    g: lerpNumber(from.g, to.g, t),
    b: lerpNumber(from.b, to.b, t),
    a: lerpNumber(from.a, to.a, t),
  });
}

function lerpCssNumber(a: string, b: string, t: number) {
  const from = Number.parseFloat(a);
  const to = Number.parseFloat(b);

  if (!Number.isFinite(from) || !Number.isFinite(to)) return b;

  return lerpNumber(from, to, t).toFixed(3);
}

function parseUnitValue(value: string): { value: number; unit: string } {
  const match = value.trim().match(/^(-?\d*\.?\d+)(.*)$/);
  if (!match) return { value: 0, unit: "" };
  return { value: Number(match[1]), unit: match[2] ?? "" };
}

function lerpUnitValue(a: string, b: string, t: number): string {
  const parsedA = parseUnitValue(a);
  const parsedB = parseUnitValue(b);
  if (parsedA.unit !== parsedB.unit) return b;
  return `${lerpNumber(parsedA.value, parsedB.value, t).toFixed(3)}${parsedA.unit}`;
}

function toScaledCssNumber(value: string, scale: number, offset = 0) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return offset.toFixed(3);
  return (offset + parsed * scale).toFixed(3);
}

function lerpProfile(
  current: ArtworkAtmosphereProfile,
  target: ArtworkAtmosphereProfile,
  t: number,
): ArtworkAtmosphereProfile {
  return {
    slug: target.slug,
    name: target.name,
    wash: lerpColor(current.wash, target.wash, t),
    washStrong: lerpColor(current.washStrong, target.washStrong, t),
    glow: lerpColor(current.glow, target.glow, t),
    shadow: lerpColor(current.shadow, target.shadow, t),
    shadowWash: lerpColor(current.shadowWash, target.shadowWash, t),
    accent: lerpColor(current.accent, target.accent, t),
    pressure: lerpCssNumber(current.pressure, target.pressure, t),
    density: lerpCssNumber(current.density, target.density, t),
    fieldOpacity: lerpCssNumber(current.fieldOpacity, target.fieldOpacity, t),
    focusedOpacity: lerpCssNumber(current.focusedOpacity, target.focusedOpacity, t),
    inspectOpacity: lerpCssNumber(current.inspectOpacity, target.inspectOpacity, t),
  };
}

function cloneSectionState(state: SectionAtmosphereState): SectionAtmosphereState {
  return { ...state };
}

function lerpSectionState(
  current: SectionAtmosphereState,
  target: SectionAtmosphereState,
  t: number,
): SectionAtmosphereState {
  return {
    id: target.id,
    label: target.label,
    fieldOpacity: lerpCssNumber(current.fieldOpacity, target.fieldOpacity, t),
    focusedOpacity: lerpCssNumber(current.focusedOpacity, target.focusedOpacity, t),
    inspectOpacity: lerpCssNumber(current.inspectOpacity, target.inspectOpacity, t),
    saturation: lerpCssNumber(current.saturation, target.saturation, t),
    contrast: lerpCssNumber(current.contrast, target.contrast, t),
    blur: lerpUnitValue(current.blur, target.blur, t),
    scale: lerpCssNumber(current.scale, target.scale, t),
    driftX: lerpUnitValue(current.driftX, target.driftX, t),
    driftY: lerpUnitValue(current.driftY, target.driftY, t),
    breathDuration: lerpUnitValue(current.breathDuration, target.breathDuration, t),
    density: lerpCssNumber(current.density, target.density, t),
    pressure: lerpCssNumber(current.pressure, target.pressure, t),
    calm: lerpCssNumber(current.calm, target.calm, t),
  };
}

function clonePresenceState(state: PresenceAtmosphereState): PresenceAtmosphereState {
  return { ...state };
}

function lerpPresenceState(
  current: PresenceAtmosphereState,
  target: PresenceAtmosphereState,
  t: number,
): PresenceAtmosphereState {
  return {
    id: target.id,
    label: target.label,
    stillness: lerpCssNumber(current.stillness, target.stillness, t),
    depth: lerpCssNumber(current.depth, target.depth, t),
    calm: lerpCssNumber(current.calm, target.calm, t),
    uiQuiet: lerpCssNumber(current.uiQuiet, target.uiQuiet, t),
    haloBoost: lerpCssNumber(current.haloBoost, target.haloBoost, t),
    labelOpacity: lerpCssNumber(current.labelOpacity, target.labelOpacity, t),
    secondaryOpacity: lerpCssNumber(current.secondaryOpacity, target.secondaryOpacity, t),
    breathMultiplier: lerpCssNumber(current.breathMultiplier, target.breathMultiplier, t),
  };
}

function clonePresenceCurve(curve: ArtworkPresenceCurve): ArtworkPresenceCurve {
  return { ...curve };
}

function lerpPresenceCurve(
  current: ArtworkPresenceCurve,
  target: ArtworkPresenceCurve,
  t: number,
): ArtworkPresenceCurve {
  return {
    slug: target.slug,
    label: target.label,
    temperament: target.temperament,
    tensionBase: lerpCssNumber(current.tensionBase, target.tensionBase, t),
    tensionStill: lerpCssNumber(current.tensionStill, target.tensionStill, t),
    calmBase: lerpCssNumber(current.calmBase, target.calmBase, t),
    calmStill: lerpCssNumber(current.calmStill, target.calmStill, t),
    densityBase: lerpCssNumber(current.densityBase, target.densityBase, t),
    densityStill: lerpCssNumber(current.densityStill, target.densityStill, t),
    focusPull: lerpCssNumber(current.focusPull, target.focusPull, t),
    colorSpread: lerpCssNumber(current.colorSpread, target.colorSpread, t),
    shadowWeight: lerpCssNumber(current.shadowWeight, target.shadowWeight, t),
    railVeil: lerpCssNumber(current.railVeil, target.railVeil, t),
    haloResponse: lerpCssNumber(current.haloResponse, target.haloResponse, t),
    breathScale: lerpCssNumber(current.breathScale, target.breathScale, t),
    responseSpeed: lerpCssNumber(current.responseSpeed, target.responseSpeed, t),
  };
}

function getPresenceBreathDuration(sectionBreathDuration: string, breathMultiplier: string) {
  const parsedDuration = parseUnitValue(sectionBreathDuration);
  const multiplier = Number.parseFloat(breathMultiplier);

  if (!Number.isFinite(parsedDuration.value) || !Number.isFinite(multiplier)) {
    return sectionBreathDuration;
  }

  return `${(parsedDuration.value * multiplier).toFixed(3)}${parsedDuration.unit}`;
}

function applyProfileToRoot(
  root: HTMLElement,
  profile: ArtworkAtmosphereProfile,
  targetSlug: string,
  source: string,
  state: AtmosphereInteractionState,
) {
  setRootStyleProperty(root, "--artwork-wash", profile.wash);
  setRootStyleProperty(root, "--artwork-wash-strong", profile.washStrong);
  setRootStyleProperty(root, "--artwork-glow", profile.glow);
  setRootStyleProperty(root, "--artwork-shadow", profile.shadow);
  setRootStyleProperty(root, "--artwork-shadow-wash", profile.shadowWash);
  setRootStyleProperty(root, "--artwork-accent", profile.accent);
  setRootStyleProperty(root, "--artwork-pressure", profile.pressure);
  setRootStyleProperty(root, "--artwork-density", profile.density);
  setRootStyleProperty(root, "--artwork-field-opacity", profile.fieldOpacity);
  setRootStyleProperty(root, "--artwork-field-focused-opacity", profile.focusedOpacity);
  setRootStyleProperty(root, "--artwork-field-inspect-opacity", profile.inspectOpacity);
  setRootDatasetValue(root, "artworkAtmosphere", targetSlug);
  setRootDatasetValue(root, "artworkAtmosphereSource", source);
  setRootDatasetValue(root, "artworkAtmosphereState", state);
  setRootDatasetValue(root, "livingAtmosphere", "orchestrated");
}

function applySectionToRoot(root: HTMLElement, section: SectionAtmosphereState, activeSectionId: string) {
  setRootStyleProperty(root, "--section-field-opacity", section.fieldOpacity);
  setRootStyleProperty(root, "--section-field-focused-opacity", section.focusedOpacity);
  setRootStyleProperty(root, "--section-field-inspect-opacity", section.inspectOpacity);
  setRootStyleProperty(root, "--section-saturation", section.saturation);
  setRootStyleProperty(root, "--section-contrast", section.contrast);
  setRootStyleProperty(root, "--section-blur", section.blur);
  setRootStyleProperty(root, "--section-scale", section.scale);
  setRootStyleProperty(root, "--section-drift-x", section.driftX);
  setRootStyleProperty(root, "--section-drift-y", section.driftY);
  setRootStyleProperty(root, "--section-breath-duration", section.breathDuration);
  setRootStyleProperty(root, "--section-density", section.density);
  setRootStyleProperty(root, "--section-pressure", section.pressure);
  setRootStyleProperty(root, "--section-calm", section.calm);
  setRootStyleProperty(root, "--section-density-veil", toScaledCssNumber(section.density, 0.16));
  setRootStyleProperty(root, "--section-pressure-veil", toScaledCssNumber(section.pressure, 0.14));
  setRootStyleProperty(root, "--section-calm-veil", toScaledCssNumber(section.calm, 0.07));
  setRootDatasetValue(root, "atmosphereSection", activeSectionId);
}

function applyPresenceToRoot(
  root: HTMLElement,
  presence: PresenceAtmosphereState,
  section: SectionAtmosphereState,
  activePresenceId: string,
) {
  setRootStyleProperty(root, "--presence-stillness", presence.stillness);
  setRootStyleProperty(root, "--presence-depth", presence.depth);
  setRootStyleProperty(root, "--presence-calm", presence.calm);
  setRootStyleProperty(root, "--presence-ui-quiet", presence.uiQuiet);
  setRootStyleProperty(root, "--presence-halo-boost", presence.haloBoost);
  setRootStyleProperty(root, "--presence-label-opacity", presence.labelOpacity);
  setRootStyleProperty(root, "--presence-secondary-opacity", presence.secondaryOpacity);
  setRootStyleProperty(root, "--presence-breath-multiplier", presence.breathMultiplier);
  setRootStyleProperty(
    root,
    "--presence-breath-duration",
    getPresenceBreathDuration(section.breathDuration, presence.breathMultiplier),
  );
  setRootDatasetValue(root, "presenceState", activePresenceId);
}

function applyPresenceCurveToRoot(root: HTMLElement, curve: ArtworkPresenceCurve, stillnessValue: string) {
  const stillness = Number.parseFloat(stillnessValue);
  const stillnessAmount = Number.isFinite(stillness) ? stillness : 0;
  const psychologicalTension = lerpNumber(
    Number.parseFloat(curve.tensionBase),
    Number.parseFloat(curve.tensionStill),
    stillnessAmount,
  );
  const psychologicalCalm = lerpNumber(
    Number.parseFloat(curve.calmBase),
    Number.parseFloat(curve.calmStill),
    stillnessAmount,
  );
  const psychologicalDensity = lerpNumber(
    Number.parseFloat(curve.densityBase),
    Number.parseFloat(curve.densityStill),
    stillnessAmount,
  );

  setRootStyleProperty(root, "--psychological-tension", psychologicalTension.toFixed(3));
  setRootStyleProperty(root, "--psychological-calm", psychologicalCalm.toFixed(3));
  setRootStyleProperty(root, "--psychological-density", psychologicalDensity.toFixed(3));
  setRootStyleProperty(root, "--psychological-focus-pull", curve.focusPull);
  setRootStyleProperty(root, "--psychological-color-spread", curve.colorSpread);
  setRootStyleProperty(root, "--psychological-shadow-weight", curve.shadowWeight);
  setRootStyleProperty(root, "--psychological-rail-veil", curve.railVeil);
  setRootStyleProperty(root, "--psychological-halo-response", curve.haloResponse);
  setRootStyleProperty(root, "--psychological-breath-scale", curve.breathScale);
  setRootDatasetValue(root, "presenceCurve", curve.slug);
  setRootDatasetValue(root, "presenceTemperament", curve.temperament);
}

function findArtworkTarget(eventTarget: EventTarget | null) {
  return eventTarget instanceof Element ? eventTarget.closest<HTMLElement>("[data-artwork-slug]") : null;
}

function getMemoryProfile(handoff: RouteAtmosphereHandoff | null) {
  const lastSlug = handoff?.slug ?? readLastAtmosphereSlug();
  return isKnownProfile(lastSlug) ? getArtworkAtmosphereProfile(lastSlug ?? undefined) : defaultArtworkAtmosphere;
}

function storeTargetSlug(slug: string) {
  if (!isKnownProfile(slug) || slug === defaultArtworkAtmosphere.slug) return;

  try {
    window.sessionStorage.setItem(LAST_SLUG_STORAGE_KEY, slug);
  } catch {
    // Session storage is an enhancement for route handoff memory only.
  }
}

export function initLivingAtmosphereOrchestrator() {
  if (typeof window === "undefined") return undefined;
  if (window.ArtistStageAtmosphereOrchestrator) return window.ArtistStageAtmosphereOrchestrator;

  const root = document.documentElement;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const initialHandoff = readRouteAtmosphereHandoff();
  const memoryProfile = cloneProfile(getMemoryProfile(initialHandoff));
  const pendingSignal = window.__artistStagePendingArtworkAtmosphere;
  const initialProfile = pendingSignal?.slug && isKnownProfile(pendingSignal.slug)
    ? cloneProfile(getArtworkAtmosphereProfile(pendingSignal.slug))
    : memoryProfile;
  const hasRouteMemory = memoryProfile.slug !== defaultArtworkAtmosphere.slug;

  let currentProfile = initialProfile;
  let targetProfile = cloneProfile(initialProfile);
  let targetSlug = targetProfile.slug;
  let currentSlug = currentProfile.slug;
  let pageTargetSlug = targetProfile.slug;
  let viewportTargetSlug = "";
  let focusSlug = "";
  let source = pendingSignal?.source ?? (hasRouteMemory ? "route" : "memory");
  let currentSection = cloneSectionState(defaultSectionAtmosphereState);
  let targetSection = cloneSectionState(defaultSectionAtmosphereState);
  let activeSectionId = "default";
  let activePresenceId: PresenceAtmosphereId = "active";
  let currentPresence = clonePresenceState(defaultPresenceAtmosphereState);
  let targetPresence = clonePresenceState(defaultPresenceAtmosphereState);
  let currentPresenceCurve = clonePresenceCurve(getArtworkPresenceCurve(initialProfile.slug));
  let targetPresenceCurve = clonePresenceCurve(getArtworkPresenceCurve(initialProfile.slug));
  let activePresenceCurveSlug = targetPresenceCurve.slug;
  let presenceSource = "initial";
  let livingSeed = getSlugSeed(initialProfile.slug);
  let lastActivityAt = Date.now();
  let lastStillTargetAt = Date.now();
  let lastStillTargetKey = `${targetSlug}:${activeSectionId}`;
  let isPointerStill = false;
  let routeHandoffSource = hasRouteMemory ? (initialHandoff?.source ?? "session") : "initial";
  let previousRouteSlug = hasRouteMemory ? memoryProfile.slug : defaultArtworkAtmosphere.slug;
  let routeEnterUntil = hasRouteMemory ? Date.now() + ROUTE_ENTER_DURATION : 0;
  let handoffFromPath = initialHandoff?.fromPath ?? "";
  let handoffToPath = initialHandoff?.toPath ?? "";
  let isRouteLeaving = false;
  let isIdle = false;
  let isScrolling = false;
  let isInspecting = false;
  let isWorkDetailContext = root.dataset.artworkAtmosphereContext === "work-detail";
  let idleTimer = 0;
  let scrollTimer = 0;
  let lastEnvironmentTickAt = 0;
  let lastEnvironmentSyncAt = 0;
  let lastPointerX = 0.5;
  let lastPointerY = 0.5;
  let lastPointerAt = 0;
  let lastPointerSampleAt = 0;
  let lastScrollY = window.scrollY || 0;
  let lastScrollAt = Date.now();
  let lastScrollApplyAt = 0;
  let lastIdleResetAt = 0;
  let lastExplicitHandoffAt = 0;
  let prefersReducedMotion = reducedMotionQuery.matches;
  let isDocumentVisible = !document.hidden;
  let presenceDirectorActive = root.dataset.presenceDirector === "active";
  let presenceDirectorPhase = (root.dataset.presencePhase || "awake") as PresenceDirectorPhase;
  let animationFrame = 0;
  let lastTickAt = 0;
  let lastStyleFrameAt = 0;
  const livingEnvironment = createLivingEnvironmentState();
  const visibleArtwork = new Map<HTMLElement, { slug: string; ratio: number }>();
  const visibleArtworkElements = new Map<string, HTMLElement>();

  function getEffectiveState(): AtmosphereInteractionState {
    if (isInspecting) return "inspecting";
    if (focusSlug) return "focused";
    if (isScrolling) return "scrolling";
    if (isRouteLeaving) return "route-leave";
    if (routeEnterUntil && Date.now() <= routeEnterUntil) return "route-enter";
    if (isIdle) return "idle";
    return "settled";
  }

  function syncLivingEnvironmentIfNeeded(force = false) {
    const now = performance.now();
    const interval =
      isRouteLeaving || routeEnterUntil || isInspecting || focusSlug
        ? ENVIRONMENT_PRIORITY_STYLE_INTERVAL_MS
        : ENVIRONMENT_STYLE_INTERVAL_MS;

    if (!force && lastEnvironmentSyncAt && now - lastEnvironmentSyncAt < interval) return;

    lastEnvironmentSyncAt = now;
    syncLivingEnvironmentToRoot(root, livingEnvironment);
  }

  function bumpEnvironmentActivity(value: number, velocityBoost = 0) {
    livingEnvironment.targetActivity = Math.max(livingEnvironment.targetActivity, clampNumber(value));
    livingEnvironment.targetVelocity = Math.max(livingEnvironment.targetVelocity, clampNumber(velocityBoost));
  }

  function getActivityBoost(sourceName: string) {
    if (sourceName === "focus") return 0.94;
    if (sourceName === "scroll") return 0.74;
    if (sourceName === "touch") return 0.68;
    if (sourceName === "keyboard") return 0.52;
    if (sourceName === "target-change") return 0.62;
    return 0.44;
  }

  function setEnvironmentFocusFromElement(element?: HTMLElement) {
    if (!element) {
      livingEnvironment.targetFocusX = livingEnvironment.targetCursorX;
      livingEnvironment.targetFocusY = livingEnvironment.targetCursorY;
      return;
    }

    const center = getElementCenter(element);
    livingEnvironment.targetFocusX = center.x;
    livingEnvironment.targetFocusY = center.y;
  }

  function updatePointerEnvironment(clientX: number, clientY: number) {
    const width = window.innerWidth || document.documentElement.clientWidth || 1;
    const height = window.innerHeight || document.documentElement.clientHeight || 1;
    const nextX = clampNumber(clientX / width);
    const nextY = clampNumber(clientY / height);
    const now = performance.now();
    const elapsed = Math.max(16, now - (lastPointerAt || now));
    const distance = Math.hypot(nextX - lastPointerX, nextY - lastPointerY);
    const velocity = clampNumber((distance / elapsed) * 1000 * POINTER_VELOCITY_SCALE);

    livingEnvironment.targetCursorX = nextX;
    livingEnvironment.targetCursorY = nextY;

    if (!focusSlug) {
      livingEnvironment.targetFocusX = nextX;
      livingEnvironment.targetFocusY = nextY;
    }

    bumpEnvironmentActivity(0.36 + velocity * 0.42, velocity);
    lastPointerX = nextX;
    lastPointerY = nextY;
    lastPointerAt = now;
  }

  function updateLivingEnvironment(now: number) {
    const elapsed = Math.min(100, Math.max(1, now - (lastEnvironmentTickAt || now - 16.67)));
    lastEnvironmentTickAt = now;

    if (prefersReducedMotion) {
      livingEnvironment.activity = 0;
      livingEnvironment.targetActivity = 0;
      livingEnvironment.velocity = 0;
      livingEnvironment.targetVelocity = 0;
      livingEnvironment.pulseA = 0.5;
      livingEnvironment.pulseB = 0.5;
      livingEnvironment.driftX = 0;
      livingEnvironment.driftY = 0;
      livingEnvironment.counterDriftX = 0;
      livingEnvironment.counterDriftY = 0;
      livingEnvironment.hueRotate = 0;
      livingEnvironment.cursorX = 0.5;
      livingEnvironment.cursorY = 0.5;
      livingEnvironment.focusX = livingEnvironment.targetFocusX;
      livingEnvironment.focusY = livingEnvironment.targetFocusY;
      livingEnvironment.fieldAX = livingEnvironment.focusX;
      livingEnvironment.fieldAY = livingEnvironment.focusY;
      livingEnvironment.fieldBX = 0.68;
      livingEnvironment.fieldBY = 0.42;
      livingEnvironment.fieldCX = 0.48;
      livingEnvironment.fieldCY = 0.78;
      livingEnvironment.proximity = 0;
      return;
    }

    const decay = Math.pow(ENVIRONMENT_DECAY, elapsed / 16.67);
    const velocityDecay = Math.pow(ENVIRONMENT_VELOCITY_DECAY, elapsed / 16.67);
    const cursorAmount = getDampingAmount(ENVIRONMENT_CURSOR_DAMP_RATE, elapsed);
    const focusAmount = getDampingAmount(ENVIRONMENT_FOCUS_DAMP_RATE, elapsed);
    const activityAmount = getDampingAmount(ENVIRONMENT_ACTIVITY_DAMP_RATE, elapsed);
    const velocityAmount = getDampingAmount(ENVIRONMENT_VELOCITY_DAMP_RATE, elapsed);
    livingEnvironment.targetActivity *= decay;
    livingEnvironment.targetVelocity *= velocityDecay;
    livingEnvironment.cursorX = lerpNumber(livingEnvironment.cursorX, livingEnvironment.targetCursorX, cursorAmount);
    livingEnvironment.cursorY = lerpNumber(livingEnvironment.cursorY, livingEnvironment.targetCursorY, cursorAmount);
    livingEnvironment.focusX = lerpNumber(livingEnvironment.focusX, livingEnvironment.targetFocusX, focusAmount);
    livingEnvironment.focusY = lerpNumber(livingEnvironment.focusY, livingEnvironment.targetFocusY, focusAmount);
    livingEnvironment.activity = lerpNumber(
      livingEnvironment.activity,
      livingEnvironment.targetActivity,
      activityAmount,
    );
    livingEnvironment.velocity = lerpNumber(
      livingEnvironment.velocity,
      livingEnvironment.targetVelocity,
      velocityAmount,
    );

    const time = now / 1000;
    const seedAngle = livingSeed * Math.PI * 2;
    const tension = Number.parseFloat(currentPresenceCurve.focusPull) || 0.42;
    const density = Number.parseFloat(currentPresenceCurve.colorSpread) || 0.5;
    const stillness = Number.parseFloat(currentPresence.stillness) || 0;
    const activity = livingEnvironment.activity;
    const velocity = livingEnvironment.velocity;
    const pull = clampNumber(0.16 + tension * 0.16 + activity * 0.22 + velocity * 0.16, 0.12, 0.72);
    const ambientPull = clampNumber(0.045 + stillness * 0.08 + activity * 0.045, 0.035, 0.22);
    const baseAX = 0.34 + Math.sin(time * (0.15 + density * 0.05) + seedAngle) * 0.075;
    const baseAY = 0.3 + Math.cos(time * 0.12 + seedAngle * 0.7) * 0.06;
    const baseBX = 0.68 + Math.cos(time * (0.11 + tension * 0.04) + seedAngle * 1.9) * 0.085;
    const baseBY = 0.42 + Math.sin(time * 0.14 + seedAngle * 1.3) * 0.075;
    const baseCX = 0.48 + Math.sin(time * 0.09 + seedAngle * 2.4) * 0.07;
    const baseCY = 0.78 + Math.cos(time * 0.1 + seedAngle * 1.6) * 0.065;
    const pulseA = 0.5 + Math.sin(time * (0.32 + density * 0.12) + seedAngle) * 0.5;
    const pulseB = 0.5 + Math.cos(time * (0.23 + tension * 0.1) + seedAngle * 1.7) * 0.5;
    const distanceToFocus = Math.hypot(
      livingEnvironment.cursorX - livingEnvironment.focusX,
      livingEnvironment.cursorY - livingEnvironment.focusY,
    );
    const driftAmplitude = 7 + density * 9 + activity * 16 + velocity * 10;

    livingEnvironment.pulseA = pulseA;
    livingEnvironment.pulseB = pulseB;
    livingEnvironment.proximity = clampNumber(1 - distanceToFocus * 1.85);
    livingEnvironment.fieldAX = clampNumber(lerpNumber(baseAX, livingEnvironment.focusX, pull));
    livingEnvironment.fieldAY = clampNumber(lerpNumber(baseAY, livingEnvironment.focusY, pull));
    livingEnvironment.fieldBX = clampNumber(lerpNumber(baseBX, livingEnvironment.cursorX, ambientPull + velocity * 0.06));
    livingEnvironment.fieldBY = clampNumber(lerpNumber(baseBY, livingEnvironment.cursorY, ambientPull + velocity * 0.06));
    livingEnvironment.fieldCX = clampNumber(
      lerpNumber(baseCX, 1 - livingEnvironment.cursorX, activity * 0.045 + stillness * 0.055),
    );
    livingEnvironment.fieldCY = clampNumber(
      lerpNumber(baseCY, 1 - livingEnvironment.cursorY, activity * 0.04 + stillness * 0.055),
    );
    livingEnvironment.driftX =
      (livingEnvironment.cursorX - 0.5) * (4 + activity * 10) +
      Math.sin(time * 0.18 + seedAngle) * driftAmplitude;
    livingEnvironment.driftY =
      (livingEnvironment.cursorY - 0.5) * (3 + activity * 8) +
      Math.cos(time * 0.16 + seedAngle * 0.8) * driftAmplitude;
    livingEnvironment.counterDriftX = -livingEnvironment.driftX * (0.42 + pulseB * 0.12);
    livingEnvironment.counterDriftY = -livingEnvironment.driftY * (0.36 + pulseA * 0.12);
    livingEnvironment.hueRotate =
      Math.sin(time * 0.055 + seedAngle) * (5.5 + density * 12) +
      Math.cos(time * 0.034 + seedAngle * 1.7) * (2.5 + stillness * 5) +
      (livingEnvironment.cursorX - 0.5) * activity * 16;
  }

  function updateDebugPanel() {
    const panel = document.querySelector<HTMLElement>(".artwork-atmosphere-debug");
    if (!panel) return;

    const styles = getComputedStyle(root);
    const slugNode = panel.querySelector("[data-debug-slug]");
    const sourceNode = panel.querySelector("[data-debug-source]");
    const stateNode = panel.querySelector("[data-debug-state]");
    const sectionNode = panel.querySelector("[data-debug-section]");
    const presenceNode = panel.querySelector("[data-debug-presence]");
    const stillnessNode = panel.querySelector("[data-debug-stillness]");
    const depthNode = panel.querySelector("[data-debug-depth]");
    const calmNode = panel.querySelector("[data-debug-calm]");
    const contextNode = panel.querySelector("[data-debug-context]");
    const routeEnterNode = panel.querySelector("[data-debug-route-enter]");
    const previousNode = panel.querySelector("[data-debug-previous]");
    const handoffNode = panel.querySelector("[data-debug-handoff]");
    const routeNode = panel.querySelector("[data-debug-route]");
    const curveNode = panel.querySelector("[data-debug-curve]");
    const temperamentNode = panel.querySelector("[data-debug-temperament]");
    const psychologicalNode = panel.querySelector("[data-debug-psychological]");
    const focusNode = panel.querySelector("[data-debug-focus-pull]");
    const environmentNode = panel.querySelector("[data-debug-environment]");
    const cursorNode = panel.querySelector("[data-debug-cursor]");
    const washNode = panel.querySelector<HTMLElement>("[data-debug-wash]");
    const glowNode = panel.querySelector<HTMLElement>("[data-debug-glow]");
    const accentNode = panel.querySelector<HTMLElement>("[data-debug-accent]");

    if (slugNode) slugNode.textContent = `current: ${currentSlug} / target: ${targetSlug}`;
    if (sourceNode) sourceNode.textContent = `source: ${source}`;
    if (stateNode) stateNode.textContent = `state: ${getEffectiveState()}`;
    if (sectionNode) sectionNode.textContent = `section: ${activeSectionId} / ${targetSection.label}`;
    if (presenceNode) presenceNode.textContent = `presence: ${activePresenceId} / ${targetPresence.label} / ${presenceSource}`;
    if (stillnessNode) stillnessNode.textContent = `stillness: ${currentPresence.stillness}`;
    if (depthNode) depthNode.textContent = `depth: ${currentPresence.depth}`;
    if (calmNode) calmNode.textContent = `calm: ${currentPresence.calm}`;
    if (contextNode) contextNode.textContent = `context: ${isWorkDetailContext ? "work-detail" : "global"}`;
    if (routeEnterNode) routeEnterNode.textContent = `route-enter: ${Math.max(0, routeEnterUntil - Date.now())}ms`;
    if (previousNode) previousNode.textContent = `previous: ${previousRouteSlug}`;
    if (handoffNode) handoffNode.textContent = `handoff: ${routeHandoffSource}`;
    if (routeNode) routeNode.textContent = `route: ${handoffFromPath || "direct"} -> ${handoffToPath || window.location.pathname}`;
    if (curveNode) curveNode.textContent = `curve: ${activePresenceCurveSlug} / ${currentPresenceCurve.label}`;
    if (temperamentNode) temperamentNode.textContent = `temperament: ${currentPresenceCurve.temperament}`;
    if (psychologicalNode) {
      psychologicalNode.textContent = `tension/calm/density: ${styles.getPropertyValue("--psychological-tension").trim()} / ${styles.getPropertyValue("--psychological-calm").trim()} / ${styles.getPropertyValue("--psychological-density").trim()}`;
    }
    if (focusNode) focusNode.textContent = `focus: ${styles.getPropertyValue("--psychological-focus-pull").trim()}`;
    if (environmentNode) {
      environmentNode.textContent = `environment: ${livingEnvironment.activity.toFixed(3)} / ${livingEnvironment.velocity.toFixed(3)}`;
    }
    if (cursorNode) {
      cursorNode.textContent = `cursor/focus: ${livingEnvironment.cursorX.toFixed(2)},${livingEnvironment.cursorY.toFixed(2)} / ${livingEnvironment.focusX.toFixed(2)},${livingEnvironment.focusY.toFixed(2)}`;
    }
    if (washNode) washNode.style.background = styles.getPropertyValue("--artwork-wash-strong");
    if (glowNode) glowNode.style.background = styles.getPropertyValue("--artwork-glow");
    if (accentNode) accentNode.style.background = styles.getPropertyValue("--artwork-accent");
  }

  function applyCurrentProfile() {
    const state = getEffectiveState();
    applyProfileToRoot(root, currentProfile, targetSlug, source, state);
    applySectionToRoot(root, currentSection, activeSectionId);
    applyPresenceToRoot(root, currentPresence, currentSection, activePresenceId);
    applyPresenceCurveToRoot(root, currentPresenceCurve, currentPresence.stillness);
    syncLivingEnvironmentIfNeeded();
    setRootDatasetValue(root, "atmosphereHandoffSource", routeHandoffSource);
    setRootDatasetValue(root, "atmospherePreviousSlug", previousRouteSlug);
    if (isWorkDetailContext) {
      setRootDatasetValue(root, "artworkAtmosphereContext", "work-detail");
    } else {
      deleteRootDatasetValue(root, "artworkAtmosphereContext");
    }
    setRootDatasetValue(root, "atmosphereRouteEnterRemaining", String(Math.max(0, routeEnterUntil - Date.now())));
    updateDebugPanel();
  }

  function setPresenceCurveForArtwork(slug?: string) {
    const curve = getArtworkPresenceCurve(slug);
    targetPresenceCurve = clonePresenceCurve(curve);
    activePresenceCurveSlug = curve.slug;
    livingSeed = getSlugSeed(curve.slug);
  }

  function setTarget(slug: string, options: SetTargetOptions = {}) {
    const profile = getArtworkAtmosphereProfile(slug);
    const nextSlug = profile.slug;
    const nextSource = options.source ?? "event";
    const isSameTarget = targetSlug === nextSlug;
    const shouldApplyImmediately = Boolean(options.immediate || prefersReducedMotion);

    source = nextSource;

    if (source === "work-detail") {
      isWorkDetailContext = true;
      setRootDatasetValue(root, "artworkAtmosphereContext", "work-detail");
      pageTargetSlug = nextSlug;

      if (routeEnterUntil) {
        routeEnterUntil = Math.min(routeEnterUntil, Date.now() + WORK_DETAIL_HANDOFF_MS);
      }
    } else if (source === "page" || source === "section" || source === "event") {
      pageTargetSlug = nextSlug;
    }

    if (isSameTarget && !options.immediate) {
      storeTargetSlug(nextSlug);
      applyCurrentProfile();
      return;
    }

    targetProfile = cloneProfile(profile);
    targetSlug = nextSlug;
    setPresenceCurveForArtwork(nextSlug);
    bumpEnvironmentActivity(source === "focus" ? 0.92 : source === "viewport" ? 0.48 : 0.38, 0.18);

    if (shouldApplyImmediately) {
      currentProfile = cloneProfile(profile);
      currentPresenceCurve = clonePresenceCurve(targetPresenceCurve);
      currentSlug = nextSlug;
    }

    storeTargetSlug(nextSlug);
    applyCurrentProfile();
  }

  function setSection(sectionId: string, options: { source?: string; immediate?: boolean } = {}) {
    const section = getSectionAtmosphereState(sectionId);

    targetSection = cloneSectionState(section);
    activeSectionId = section.id;

    if (options.immediate || prefersReducedMotion) {
      currentSection = cloneSectionState(section);
    }

    applyCurrentProfile();
  }

  function setPresence(
    presenceId: PresenceAtmosphereId,
    options: { source?: string; immediate?: boolean } = {},
  ) {
    const presence = getPresenceAtmosphereState(presenceId);
    const nextPresenceId = presence.id as PresenceAtmosphereId;

    if (activePresenceId === nextPresenceId && !options.immediate) {
      presenceSource = options.source ?? presenceSource;
      return;
    }

    targetPresence = clonePresenceState(presence);
    activePresenceId = nextPresenceId;
    presenceSource = options.source ?? "event";

    if (options.immediate || prefersReducedMotion) {
      currentPresence = clonePresenceState(presence);
    }

    applyCurrentProfile();
  }

  function getStillTargetKey() {
    return `${targetSlug}:${activeSectionId}`;
  }

  function markActivity(sourceName = "activity") {
    lastActivityAt = Date.now();
    isPointerStill = false;
    bumpEnvironmentActivity(getActivityBoost(sourceName), sourceName === "scroll" ? 0.6 : 0.2);
    setPresence("active", { source: sourceName });
  }

  function updatePresenceFromTime() {
    if (presenceDirectorActive) {
      setPresence(getPresenceIdForDirectorPhase(presenceDirectorPhase), {
        source: `presence-director:${presenceDirectorPhase}`,
      });
      return;
    }

    const now = Date.now();
    const stillTargetKey = getStillTargetKey();

    if (stillTargetKey !== lastStillTargetKey) {
      lastStillTargetKey = stillTargetKey;
      lastStillTargetAt = now;
      lastActivityAt = now;
      setPresence("active", { source: "target-change" });
      return;
    }

    const elapsed = now - lastActivityAt;
    const sameTargetElapsed = now - lastStillTargetAt;

    if (elapsed > 320) {
      isPointerStill = true;
    }

    if (isInspecting) {
      if (elapsed > PRESENCE_STILL_MS) {
        setPresence("still", { source: "inspect-stillness" });
      } else if (elapsed > PRESENCE_SETTLING_MS) {
        setPresence("settling", { source: "inspect-stillness" });
      }
      return;
    }

    if (elapsed > PRESENCE_DEEP_MS && sameTargetElapsed > PRESENCE_DEEP_MS && isPointerStill) {
      setPresence("deep", { source: "stillness" });
    } else if (elapsed > PRESENCE_STILL_MS) {
      setPresence("still", { source: "stillness" });
    } else if (elapsed > PRESENCE_SETTLING_MS) {
      setPresence("settling", { source: "stillness" });
    }
  }

  function pickViewportTarget() {
    const candidates = new Map<string, { ratio: number; element: HTMLElement }>();

    visibleArtwork.forEach((entry, element) => {
      const candidate = candidates.get(entry.slug);
      if (!candidate || entry.ratio > candidate.ratio) {
        candidates.set(entry.slug, { ratio: entry.ratio, element });
      }
    });

    visibleArtworkElements.clear();
    candidates.forEach((candidate, slug) => {
      visibleArtworkElements.set(slug, candidate.element);
    });

    const best = [...candidates.entries()].sort((a, b) => b[1].ratio - a[1].ratio)[0];

    if (!best || best[1].ratio <= VIEWPORT_MIN_RATIO) return "";

    const current = viewportTargetSlug ? candidates.get(viewportTargetSlug) : undefined;
    if (
      current &&
      current.ratio > VIEWPORT_MIN_RATIO &&
      best[0] !== viewportTargetSlug &&
      best[1].ratio < current.ratio + VIEWPORT_SWITCH_MARGIN
    ) {
      return viewportTargetSlug;
    }

    return best[0];
  }

  function returnToPersistentTarget() {
    if (isInspecting) return;

    if (isWorkDetailContext) {
      setTarget(pageTargetSlug || targetSlug || defaultArtworkAtmosphere.slug, {
        source: pageTargetSlug ? "work-detail" : "fallback",
      });
      return;
    }

    const nextViewportSlug = pickViewportTarget();
    if (nextViewportSlug) {
      viewportTargetSlug = nextViewportSlug;
      setEnvironmentFocusFromElement(visibleArtworkElements.get(nextViewportSlug));
      setTarget(nextViewportSlug, { source: "viewport" });
      return;
    }

    setEnvironmentFocusFromElement();
    setTarget(pageTargetSlug || defaultArtworkAtmosphere.slug, {
      source: pageTargetSlug ? "page" : "fallback",
    });
  }

  function setFocus(slug: string, originElement?: HTMLElement) {
    if (!isKnownProfile(slug)) return;

    markActivity("focus");
    setEnvironmentFocusFromElement(originElement);
    focusSlug = slug;
    isIdle = false;
    setTarget(slug, { source: "focus" });
  }

  function clearFocus() {
    focusSlug = "";
    setEnvironmentFocusFromElement();
    returnToPersistentTarget();
  }

  function setState(state: AtmosphereInteractionState) {
    if (state === "inspecting") {
      isInspecting = true;
      isIdle = false;
      isScrolling = false;
      isRouteLeaving = false;
    } else if (state === "focused") {
      isIdle = false;
    } else if (state === "scrolling") {
      isScrolling = true;
      isIdle = false;
      isRouteLeaving = false;
    } else if (state === "idle") {
      isIdle = true;
      isScrolling = false;
      isRouteLeaving = false;
    } else if (state === "route-enter") {
      routeEnterUntil = Date.now() + (isWorkDetailContext ? WORK_DETAIL_HANDOFF_MS : ROUTE_ENTER_DURATION);
      isRouteLeaving = false;
      isIdle = false;
      isScrolling = false;
    } else if (state === "route-leave") {
      isRouteLeaving = true;
      isIdle = false;
      isScrolling = false;
    } else {
      isInspecting = false;
      isScrolling = false;
      isIdle = false;
      isRouteLeaving = false;
      routeEnterUntil = 0;
    }

    applyCurrentProfile();
  }

  function prepareRouteHandoff(
    toPath?: string,
    slugOverride?: string,
    handoffSource: RouteAtmosphereHandoff["source"] = "link",
  ) {
    const nextSlug =
      slugOverride ||
      focusSlug ||
      targetSlug ||
      root.dataset.artworkAtmosphere ||
      defaultArtworkAtmosphere.slug;
    const handoffSlug = isKnownProfile(nextSlug) ? getArtworkAtmosphereProfile(nextSlug).slug : defaultArtworkAtmosphere.slug;

    previousRouteSlug = handoffSlug;
    routeHandoffSource = handoffSource;
    handoffFromPath = window.location.pathname;
    handoffToPath = toPath ?? "";
    if (handoffSource === "link") {
      lastExplicitHandoffAt = Date.now();
    }

    writeRouteAtmosphereHandoff({
      slug: handoffSlug,
      source: handoffSource,
      fromPath: window.location.pathname,
      toPath,
      sectionId: activeSectionId,
      state: getEffectiveState(),
      timestamp: Date.now(),
    });

    setState("route-leave");
  }

  function resetIdleTimer(sourceName = "activity", shouldMarkActivity = true) {
    const now = Date.now();

    if (presenceDirectorActive) {
      window.clearTimeout(idleTimer);
      if (shouldMarkActivity) markActivity(sourceName);
      return;
    }

    if (shouldMarkActivity && now - lastIdleResetAt < ACTIVITY_TIMER_THROTTLE_MS) {
      lastActivityAt = now;
      isPointerStill = false;
      return;
    }

    lastIdleResetAt = now;

    if (shouldMarkActivity) {
      markActivity(sourceName);
    }
    window.clearTimeout(idleTimer);

    const wasIdle = isIdle;

    if (!isInspecting && !focusSlug) {
      isIdle = false;
    }

    if (wasIdle) applyCurrentProfile();

    idleTimer = window.setTimeout(() => {
      if (isInspecting || focusSlug) return;
      isIdle = true;
      isScrolling = false;
      applyCurrentProfile();
    }, IDLE_DELAY);
  }

  function handleScrollActivity() {
    const now = Date.now();
    const nextScrollY = window.scrollY || 0;
    const elapsed = Math.max(16, now - lastScrollAt);
    const scrollVelocity = clampNumber(Math.abs(nextScrollY - lastScrollY) / elapsed * SCROLL_VELOCITY_SCALE);
    lastScrollY = nextScrollY;
    lastScrollAt = now;
    bumpEnvironmentActivity(0.62 + scrollVelocity * 0.32, scrollVelocity);
    lastActivityAt = now;
    isPointerStill = false;

    if (!lastScrollApplyAt || now - lastScrollApplyAt >= SCROLL_ACTIVITY_THROTTLE_MS) {
      lastScrollApplyAt = now;
      markActivity("scroll");

      if (!isInspecting && !focusSlug) {
        isScrolling = true;
        isIdle = false;
        applyCurrentProfile();
      }
    } else if (!isInspecting && !focusSlug) {
      isScrolling = true;
      isIdle = false;
    }

    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      applyCurrentProfile();
    }, SCROLL_SETTLE_DELAY);

    resetIdleTimer("scroll", false);
  }

  function handlePointerOver(event: PointerEvent) {
    const target = findArtworkTarget(event.target);
    const slug = target?.dataset.artworkSlug;
    if (!slug) return;

    setFocus(slug, target);
  }

  function handlePointerOut(event: PointerEvent) {
    const target = findArtworkTarget(event.target);
    if (!target) return;
    if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;

    clearFocus();
  }

  function handleFocusIn(event: FocusEvent) {
    markActivity("focus");

    const target = findArtworkTarget(event.target);
    const slug = target?.dataset.artworkSlug;
    if (!slug) return;

    setFocus(slug, target);
  }

  function handleFocusOut(event: FocusEvent) {
    const target = findArtworkTarget(event.target);
    if (!target) return;
    if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;

    clearFocus();
  }

  function handlePointerMove(event: PointerEvent) {
    const now = performance.now();

    if (!lastPointerSampleAt || now - lastPointerSampleAt >= POINTER_SAMPLE_INTERVAL_MS) {
      lastPointerSampleAt = now;
      updatePointerEnvironment(event.clientX, event.clientY);
    }

    if (!presenceDirectorActive) {
      resetIdleTimer("pointer");
    }
  }

  function handleLinkClick(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    let url: URL;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    const slug =
      link.dataset.atmosphereHandoffSlug ||
      link.closest<HTMLElement>("[data-artwork-slug]")?.dataset.artworkSlug ||
      root.dataset.artworkAtmosphere ||
      undefined;

    prepareRouteHandoff(url.pathname, slug);
  }

  function handlePageHide() {
    if (Date.now() - lastExplicitHandoffAt <= 300) return;
    prepareRouteHandoff(window.location.pathname, undefined, "route");
  }

  function initViewportObserver() {
    const worksField = document.querySelector<HTMLElement>(
      '[data-works-atmosphere-field]:not([data-atmosphere-manual="true"])',
    );
    if (!worksField || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const slug = element.dataset.artworkSlug;
          if (!slug) return;

          if (entry.isIntersecting) {
            visibleArtwork.set(element, { slug, ratio: entry.intersectionRatio });
          } else {
            visibleArtwork.delete(element);
          }
        });

        if (focusSlug || isInspecting) return;
        if (isWorkDetailContext) return;

        const bestSlug = pickViewportTarget();
        if (!bestSlug) return;

        setEnvironmentFocusFromElement(visibleArtworkElements.get(bestSlug));
        if (bestSlug === viewportTargetSlug) return;
        viewportTargetSlug = bestSlug;
        setTarget(bestSlug, { source: "viewport" });
      },
      {
        threshold: Array.from({ length: 21 }, (_, index) => index / 20),
      },
    );

    worksField.querySelectorAll<HTMLElement>("[data-artwork-slug]").forEach((item) => observer.observe(item));
  }

  function initSectionObserver() {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-atmosphere-section]")].filter(
      (section) => section !== root,
    );
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const visibleSections = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = (entry.target as HTMLElement).dataset.atmosphereSection;
          if (!section) return;

          if (entry.isIntersecting) {
            visibleSections.set(section, entry.intersectionRatio);
          } else {
            visibleSections.delete(section);
          }
        });

        if (isInspecting) return;

        const [bestSection, bestRatio] = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];

        if (bestSection && bestRatio > SECTION_MIN_RATIO) {
          setSection(bestSection, { source: "section" });
        }
      },
      {
        threshold: [0, 0.15, 0.22, 0.35, 0.5, 0.75, 1],
        rootMargin: "-12% 0px -28% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initDebugPanel() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("atmoDebug") || document.querySelector(".artwork-atmosphere-debug")) return;

    const panel = document.createElement("div");
    panel.className = "artwork-atmosphere-debug";
    panel.innerHTML = `
      <strong>Artwork atmosphere</strong>
      <span data-debug-slug></span>
      <span data-debug-source></span>
      <span data-debug-state></span>
      <span data-debug-section></span>
      <span data-debug-presence></span>
      <span data-debug-stillness></span>
      <span data-debug-depth></span>
      <span data-debug-calm></span>
      <span data-debug-context></span>
      <span data-debug-route-enter></span>
      <span data-debug-previous></span>
      <span data-debug-handoff></span>
      <span data-debug-route></span>
      <span data-debug-curve></span>
      <span data-debug-temperament></span>
      <span data-debug-psychological></span>
      <span data-debug-focus-pull></span>
      <span data-debug-environment></span>
      <span data-debug-cursor></span>
      <i data-debug-wash></i>
      <i data-debug-glow></i>
      <i data-debug-accent></i>
    `;

    document.body.appendChild(panel);
    updateDebugPanel();
  }

  const api: OrchestratorApi = {
    setTarget,
    setSection,
    setFocus,
    clearFocus,
    setState,
    prepareRouteHandoff,
    setPresence,
    getState: () => ({
      targetSlug,
      currentSlug,
      previousRouteSlug,
      state: getEffectiveState(),
      source,
      sectionId: activeSectionId,
      sectionLabel: targetSection.label,
      presenceId: activePresenceId,
      presenceLabel: targetPresence.label,
      stillness: currentPresence.stillness,
      depth: currentPresence.depth,
      calm: currentPresence.calm,
      context: isWorkDetailContext ? "work-detail" : "global",
      routeEnterRemaining: Math.max(0, routeEnterUntil - Date.now()),
      handoffSource: routeHandoffSource,
      handoffFromPath,
      handoffToPath,
      presenceCurveSlug: activePresenceCurveSlug,
      presenceCurveLabel: currentPresenceCurve.label,
      presenceTemperament: currentPresenceCurve.temperament,
      psychologicalTension: root.style.getPropertyValue("--psychological-tension"),
      psychologicalCalm: root.style.getPropertyValue("--psychological-calm"),
      psychologicalDensity: root.style.getPropertyValue("--psychological-density"),
      psychologicalFocusPull: currentPresenceCurve.focusPull,
      livingActivity: livingEnvironment.activity.toFixed(3),
      livingVelocity: livingEnvironment.velocity.toFixed(3),
      livingCursor: `${livingEnvironment.cursorX.toFixed(3)},${livingEnvironment.cursorY.toFixed(3)}`,
      livingFocus: `${livingEnvironment.focusX.toFixed(3)},${livingEnvironment.focusY.toFixed(3)}`,
    }),
  };

  window.ArtistStageAtmosphereOrchestrator = api;

  window.addEventListener("artist-stage:artwork-atmosphere:set", (event) => {
    const detail = (event as CustomEvent<PendingAtmosphereSignal>).detail;
    if (detail?.slug) {
      setTarget(detail.slug, { source: detail.source ?? "event" });
    }
  });

  window.addEventListener("artist-stage:atmosphere-section:set", (event) => {
    const detail = (event as CustomEvent).detail;
    if (detail?.sectionId) {
      setSection(detail.sectionId, { source: detail.source ?? "event" });
    }
  });

  window.addEventListener("artist-stage:presence:set", (event) => {
    const detail = (event as CustomEvent).detail;
    if (detail?.presenceId) {
      setPresence(detail.presenceId, { source: detail.source ?? "event" });
    }
  });

  window.addEventListener("artist-stage:presence-phase", (event) => {
    const detail = (event as CustomEvent).detail;
    const phase = (detail?.phase || "awake") as PresenceDirectorPhase;

    presenceDirectorActive = true;
    presenceDirectorPhase = phase;
    isIdle = phase === "settling" || phase === "contemplating" || phase === "dreaming";

    if (isIdle) {
      isScrolling = false;
      isRouteLeaving = false;
    }

    setPresence(getPresenceIdForDirectorPhase(phase), {
      source: detail?.source ? `presence-director:${detail.source}` : `presence-director:${phase}`,
      immediate: prefersReducedMotion,
    });
    applyCurrentProfile();
  });

  document.addEventListener("pointerover", handlePointerOver);
  document.addEventListener("pointerout", handlePointerOut);
  document.addEventListener("focusin", handleFocusIn);
  document.addEventListener("focusout", handleFocusOut);
  document.addEventListener("click", handleLinkClick, { capture: true });
  window.addEventListener("scroll", handleScrollActivity, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("keydown", () => resetIdleTimer("keyboard"));
  window.addEventListener("touchstart", () => resetIdleTimer("touch"), { passive: true });
  window.addEventListener("pagehide", handlePageHide);
  document.addEventListener("visibilitychange", () => {
    isDocumentVisible = !document.hidden;
    if (isDocumentVisible) {
      lastTickAt = 0;
      lastStyleFrameAt = 0;
      requestTick();
    } else if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  });
  reducedMotionQuery.addEventListener("change", (event) => {
    prefersReducedMotion = event.matches;
    if (event.matches) {
      currentProfile = cloneProfile(targetProfile);
      currentSection = cloneSectionState(targetSection);
      currentPresence = clonePresenceState(targetPresence);
      currentPresenceCurve = clonePresenceCurve(targetPresenceCurve);
      currentSlug = targetSlug;
    }
    applyCurrentProfile();
  });

  function initDomObservers() {
    initViewportObserver();
    initSectionObserver();
  }

  initDebugPanel();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDomObservers, { once: true });
  } else {
    window.requestAnimationFrame(initDomObservers);
  }

  if (pendingSignal?.slug) {
    setTarget(pendingSignal.slug, { source: pendingSignal.source ?? "pending" });
  } else {
    applyCurrentProfile();
  }

  resetIdleTimer();

  function requestTick() {
    if (!isDocumentVisible || animationFrame) return;
    animationFrame = window.requestAnimationFrame(tick);
  }

  function tick(now: number) {
    animationFrame = 0;

    if (!isDocumentVisible) {
      return;
    }

    const elapsed = Math.min(100, Math.max(1, now - (lastTickAt || now - 16.67)));
    lastTickAt = now;

    if (routeEnterUntil && Date.now() > routeEnterUntil) {
      routeEnterUntil = 0;
    }

    updatePresenceFromTime();
    const curveRate = (Number.parseFloat(targetPresenceCurve.responseSpeed) || 0.05) * PRESENCE_CURVE_RATE_SCALE;
    const profileAmount = prefersReducedMotion
      ? 1
      : getDampingAmount(isWorkDetailContext ? WORK_DETAIL_PROFILE_DAMP_RATE : PROFILE_DAMP_RATE, elapsed);
    const sectionAmount = prefersReducedMotion ? 1 : getDampingAmount(SECTION_DAMP_RATE, elapsed);
    const presenceAmount = prefersReducedMotion ? 1 : getDampingAmount(PRESENCE_DAMP_RATE, elapsed);
    const curveAmount = prefersReducedMotion ? 1 : getDampingAmount(curveRate, elapsed);

    currentProfile = lerpProfile(currentProfile, targetProfile, profileAmount);
    currentSection = lerpSectionState(currentSection, targetSection, sectionAmount);
    currentPresence = lerpPresenceState(currentPresence, targetPresence, presenceAmount);
    currentPresenceCurve = lerpPresenceCurve(currentPresenceCurve, targetPresenceCurve, curveAmount);
    updateLivingEnvironment(now);
    currentSlug = targetSlug;

    const styleInterval = prefersReducedMotion
      ? REDUCED_MOTION_STYLE_INTERVAL_MS
      : STYLE_FRAME_INTERVAL_MS;

    if (!lastStyleFrameAt || now - lastStyleFrameAt >= styleInterval - 0.75) {
      lastStyleFrameAt = now;
      applyCurrentProfile();
    }

    requestTick();
  }

  requestTick();

  return api;
}

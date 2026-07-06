export type RouteAtmosphereHandoff = {
  slug: string;
  source: "page" | "viewport" | "focus" | "link" | "route" | "fallback";
  fromPath: string;
  toPath?: string;
  sectionId?: string;
  state?: string;
  timestamp: number;
};

const HANDOFF_KEY = "artist-stage:atmosphere:handoff";
const LAST_SLUG_KEY = "artist-stage:lastArtworkAtmosphereSlug";
const HANDOFF_MAX_AGE_MS = 1000 * 60 * 20;

export function writeRouteAtmosphereHandoff(handoff: RouteAtmosphereHandoff) {
  if (typeof sessionStorage === "undefined") return;

  try {
    sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
    sessionStorage.setItem(LAST_SLUG_KEY, handoff.slug);
  } catch {
    // Session storage may be unavailable. Fail silently.
  }
}

export function readRouteAtmosphereHandoff(): RouteAtmosphereHandoff | null {
  if (typeof sessionStorage === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as RouteAtmosphereHandoff;
    if (!parsed?.slug || !parsed?.timestamp) return null;

    const age = Date.now() - parsed.timestamp;
    if (age > HANDOFF_MAX_AGE_MS) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function readLastAtmosphereSlug(): string | null {
  if (typeof sessionStorage === "undefined") return null;

  try {
    return sessionStorage.getItem(LAST_SLUG_KEY);
  } catch {
    return null;
  }
}

export function clearRouteAtmosphereHandoff() {
  if (typeof sessionStorage === "undefined") return;

  try {
    sessionStorage.removeItem(HANDOFF_KEY);
  } catch {
    // Fail silently.
  }
}

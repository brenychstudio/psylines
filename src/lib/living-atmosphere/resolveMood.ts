import { defaultAtmosphereMood, moodStops, type AtmosphereMoodId } from "./moodStops";

export function resolveMood(pathname: string): AtmosphereMoodId {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === "/") return "metaBodies";
  if (normalizedPath === "/artist") return "studies";
  if (normalizedPath === "/contact") return "collector";
  if (normalizedPath === "/immersive" || normalizedPath.startsWith("/immersive/")) return "immersive";
  if (normalizedPath === "/collectors" || normalizedPath.startsWith("/collectors/")) return "collector";
  if (normalizedPath === "/policies" || normalizedPath.startsWith("/policies/")) return "collector";
  if (normalizedPath === "/works" || normalizedPath.startsWith("/works/")) return "collector";

  // TODO: Later phases can resolve active cycle, section state, and selected work context.
  // TODO: Do not add scroll, idle, pointer, local-time, or journey-memory logic in the MVP.
  return defaultAtmosphereMood;
}

export function isAtmosphereMood(value: string): value is AtmosphereMoodId {
  return value in moodStops;
}

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  const withoutQuery = pathname.split(/[?#]/)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "");
}

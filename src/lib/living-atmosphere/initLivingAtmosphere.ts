import { interpolateTokens } from "./interpolateTokens";
import { defaultAtmosphereMood, moodStops, type AtmosphereMoodId } from "./moodStops";
import { resolveMood } from "./resolveMood";

export function initLivingAtmosphere(pathname?: string) {
  if (typeof document === "undefined") return null;

  const root = document.documentElement;
  const targetMood = resolveMood(pathname ?? window.location.pathname);
  const currentMood = getCurrentMood(root.dataset.atmosphereMood);
  const tokens = interpolateTokens(moodStops[currentMood], moodStops[targetMood], 1);

  root.dataset.atmosphereMood = targetMood;

  Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
    root.style.setProperty(tokenName, tokenValue);
  });

  try {
    window.localStorage?.setItem("artist-stage-atmosphere-mood", targetMood);
  } catch {
    // localStorage can be unavailable in private contexts; atmosphere remains route-driven.
  }

  return targetMood;
}

function getCurrentMood(value: string | undefined): AtmosphereMoodId {
  if (value && value in moodStops) return value as AtmosphereMoodId;
  return defaultAtmosphereMood;
}

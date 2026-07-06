import type { AtmosphereMoodId } from "./moodStops";

export type ArtistStageMoodId = AtmosphereMoodId;

export function getCycleAtmosphereMood(cycle?: string): ArtistStageMoodId {
  const normalized = String(cycle ?? "").toLowerCase();

  if (
    normalized.includes("meta") ||
    normalized.includes("body") ||
    normalized.includes("bodies")
  ) {
    return "metaBodies";
  }

  if (
    normalized.includes("moon") ||
    normalized.includes("water") ||
    normalized.includes("night")
  ) {
    return "nightWater";
  }

  if (
    normalized.includes("study") ||
    normalized.includes("studies") ||
    normalized.includes("fragment")
  ) {
    return "studies";
  }

  return "collector";
}

export function getWorkAtmosphereMood(work: {
  cycle?: string;
  series?: string;
  slug?: string;
}): ArtistStageMoodId {
  if (work.slug?.startsWith("mt-")) return "metaBodies";
  return getCycleAtmosphereMood(work.cycle ?? work.series);
}

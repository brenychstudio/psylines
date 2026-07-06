export type ArtworkPresenceCurve = {
  slug: string;
  label: string;
  temperament:
    | "vegetal-emergence"
    | "red-pressure"
    | "ash-suspension"
    | "ochre-loop"
    | "olive-compression"
    | "submerged-interval"
    | "default";
  tensionBase: string;
  tensionStill: string;
  calmBase: string;
  calmStill: string;
  densityBase: string;
  densityStill: string;
  focusPull: string;
  colorSpread: string;
  shadowWeight: string;
  railVeil: string;
  haloResponse: string;
  breathScale: string;
  responseSpeed: string;
};

export const defaultArtworkPresenceCurve: ArtworkPresenceCurve = {
  slug: "default",
  label: "Default presence",
  temperament: "default",
  tensionBase: "0.38",
  tensionStill: "0.48",
  calmBase: "0.52",
  calmStill: "0.68",
  densityBase: "0.48",
  densityStill: "0.58",
  focusPull: "0.42",
  colorSpread: "0.5",
  shadowWeight: "0.5",
  railVeil: "0.18",
  haloResponse: "1",
  breathScale: "1",
  responseSpeed: "0.05",
};

export const artworkPresenceCurves: Record<string, ArtworkPresenceCurve> = {
  "mt-3": {
    slug: "mt-3",
    label: "Vegetal emergence",
    temperament: "vegetal-emergence",
    tensionBase: "0.32",
    tensionStill: "0.42",
    calmBase: "0.62",
    calmStill: "0.82",
    densityBase: "0.48",
    densityStill: "0.64",
    focusPull: "0.48",
    colorSpread: "0.58",
    shadowWeight: "0.52",
    railVeil: "0.2",
    haloResponse: "1.16",
    breathScale: "1.18",
    responseSpeed: "0.045",
  },
  "mt-1": {
    slug: "mt-1",
    label: "Red clay pressure",
    temperament: "red-pressure",
    tensionBase: "0.58",
    tensionStill: "0.76",
    calmBase: "0.42",
    calmStill: "0.5",
    densityBase: "0.6",
    densityStill: "0.76",
    focusPull: "0.62",
    colorSpread: "0.66",
    shadowWeight: "0.68",
    railVeil: "0.24",
    haloResponse: "1.22",
    breathScale: "1.08",
    responseSpeed: "0.055",
  },
  "mt-2": {
    slug: "mt-2",
    label: "Rhythmic pressure",
    temperament: "red-pressure",
    tensionBase: "0.66",
    tensionStill: "0.86",
    calmBase: "0.34",
    calmStill: "0.42",
    densityBase: "0.68",
    densityStill: "0.82",
    focusPull: "0.72",
    colorSpread: "0.74",
    shadowWeight: "0.76",
    railVeil: "0.26",
    haloResponse: "1.28",
    breathScale: "1.04",
    responseSpeed: "0.06",
  },
  "figure-in-ash-light": {
    slug: "figure-in-ash-light",
    label: "Ash suspension",
    temperament: "ash-suspension",
    tensionBase: "0.44",
    tensionStill: "0.56",
    calmBase: "0.56",
    calmStill: "0.76",
    densityBase: "0.48",
    densityStill: "0.62",
    focusPull: "0.5",
    colorSpread: "0.6",
    shadowWeight: "0.54",
    railVeil: "0.2",
    haloResponse: "1.14",
    breathScale: "1.24",
    responseSpeed: "0.042",
  },
  "mt-4": {
    slug: "mt-4",
    label: "Ochre loop",
    temperament: "ochre-loop",
    tensionBase: "0.48",
    tensionStill: "0.62",
    calmBase: "0.5",
    calmStill: "0.64",
    densityBase: "0.54",
    densityStill: "0.68",
    focusPull: "0.54",
    colorSpread: "0.62",
    shadowWeight: "0.58",
    railVeil: "0.22",
    haloResponse: "1.18",
    breathScale: "1.12",
    responseSpeed: "0.05",
  },
  "mt-5": {
    slug: "mt-5",
    label: "Olive compression",
    temperament: "olive-compression",
    tensionBase: "0.52",
    tensionStill: "0.68",
    calmBase: "0.48",
    calmStill: "0.6",
    densityBase: "0.62",
    densityStill: "0.78",
    focusPull: "0.6",
    colorSpread: "0.5",
    shadowWeight: "0.72",
    railVeil: "0.22",
    haloResponse: "1.18",
    breathScale: "1.1",
    responseSpeed: "0.046",
  },
  "quiet-red-interval": {
    slug: "quiet-red-interval",
    label: "Submerged interval",
    temperament: "submerged-interval",
    tensionBase: "0.36",
    tensionStill: "0.48",
    calmBase: "0.66",
    calmStill: "0.84",
    densityBase: "0.42",
    densityStill: "0.54",
    focusPull: "0.38",
    colorSpread: "0.44",
    shadowWeight: "0.56",
    railVeil: "0.18",
    haloResponse: "1.08",
    breathScale: "1.32",
    responseSpeed: "0.038",
  },
};

export function getArtworkPresenceCurve(slug?: string): ArtworkPresenceCurve {
  if (!slug) return defaultArtworkPresenceCurve;
  return artworkPresenceCurves[slug] ?? defaultArtworkPresenceCurve;
}

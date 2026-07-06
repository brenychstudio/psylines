export type AtmosphereMoodId =
  | "metaBodies"
  | "nightWater"
  | "studies"
  | "collector"
  | "immersive";

export type AtmosphereTokens = {
  "--atmo-top": string;
  "--atmo-mid": string;
  "--atmo-bottom": string;
  "--atmo-accent": string;
  "--glass-alpha": string;
  "--glass-border": string;
  "--grain-opacity": string;
  "--motion-depth": string;
};

export const moodStops: Record<AtmosphereMoodId, AtmosphereTokens> = {
  metaBodies: {
    "--atmo-top": "#10160f",
    "--atmo-mid": "#090d0b",
    "--atmo-bottom": "#050708",
    "--atmo-accent": "rgba(151, 190, 145, 0.22)",
    "--glass-alpha": "0.055",
    "--glass-border": "0.11",
    "--grain-opacity": "0.16",
    "--motion-depth": "1",
  },
  nightWater: {
    "--atmo-top": "#07111d",
    "--atmo-mid": "#06101a",
    "--atmo-bottom": "#03070d",
    "--atmo-accent": "rgba(134, 169, 204, 0.24)",
    "--glass-alpha": "0.05",
    "--glass-border": "0.1",
    "--grain-opacity": "0.14",
    "--motion-depth": "0.88",
  },
  studies: {
    "--atmo-top": "#18140f",
    "--atmo-mid": "#100e0c",
    "--atmo-bottom": "#070707",
    "--atmo-accent": "rgba(204, 171, 116, 0.19)",
    "--glass-alpha": "0.06",
    "--glass-border": "0.12",
    "--grain-opacity": "0.2",
    "--motion-depth": "0.72",
  },
  collector: {
    "--atmo-top": "#111214",
    "--atmo-mid": "#090b0f",
    "--atmo-bottom": "#050608",
    "--atmo-accent": "rgba(232, 218, 190, 0.18)",
    "--glass-alpha": "0.052",
    "--glass-border": "0.105",
    "--grain-opacity": "0.12",
    "--motion-depth": "0.62",
  },
  immersive: {
    "--atmo-top": "#061329",
    "--atmo-mid": "#050b18",
    "--atmo-bottom": "#03050b",
    "--atmo-accent": "rgba(91, 142, 218, 0.26)",
    "--glass-alpha": "0.045",
    "--glass-border": "0.1",
    "--grain-opacity": "0.1",
    "--motion-depth": "1.15",
  },
};

export const defaultAtmosphereMood: AtmosphereMoodId = "metaBodies";

export type SectionAtmosphereState = {
  id: string;
  label: string;
  fieldOpacity: string;
  focusedOpacity: string;
  inspectOpacity: string;
  saturation: string;
  contrast: string;
  blur: string;
  scale: string;
  driftX: string;
  driftY: string;
  breathDuration: string;
  density: string;
  pressure: string;
  calm: string;
};

export const defaultSectionAtmosphereState: SectionAtmosphereState = {
  id: "default",
  label: "Default Field",
  fieldOpacity: "0.62",
  focusedOpacity: "0.84",
  inspectOpacity: "0.9",
  saturation: "1",
  contrast: "1",
  blur: "0px",
  scale: "1",
  driftX: "0px",
  driftY: "0px",
  breathDuration: "14s",
  density: "0.5",
  pressure: "0.42",
  calm: "0.5",
};

export const sectionAtmosphereStates: Record<string, SectionAtmosphereState> = {
  "home-threshold": {
    id: "home-threshold",
    label: "Home Threshold",
    fieldOpacity: "0.66",
    focusedOpacity: "0.86",
    inspectOpacity: "0.9",
    saturation: "1.04",
    contrast: "1.01",
    blur: "0px",
    scale: "1.015",
    driftX: "0px",
    driftY: "-6px",
    breathDuration: "16s",
    density: "0.46",
    pressure: "0.36",
    calm: "0.7",
  },

  "home-cycles": {
    id: "home-cycles",
    label: "Home Cycle Signals",
    fieldOpacity: "0.52",
    focusedOpacity: "0.72",
    inspectOpacity: "0.84",
    saturation: "0.96",
    contrast: "1",
    blur: "2px",
    scale: "1.01",
    driftX: "0px",
    driftY: "4px",
    breathDuration: "20s",
    density: "0.34",
    pressure: "0.24",
    calm: "0.78",
  },

  "works-intro": {
    id: "works-intro",
    label: "Works Register",
    fieldOpacity: "0.58",
    focusedOpacity: "0.82",
    inspectOpacity: "0.9",
    saturation: "0.98",
    contrast: "1.02",
    blur: "1px",
    scale: "1.012",
    driftX: "0px",
    driftY: "0px",
    breathDuration: "17s",
    density: "0.44",
    pressure: "0.38",
    calm: "0.58",
  },

  "works-field": {
    id: "works-field",
    label: "Works Field",
    fieldOpacity: "0.68",
    focusedOpacity: "0.94",
    inspectOpacity: "0.92",
    saturation: "1.08",
    contrast: "1.035",
    blur: "0px",
    scale: "1.03",
    driftX: "8px",
    driftY: "-4px",
    breathDuration: "13s",
    density: "0.66",
    pressure: "0.62",
    calm: "0.34",
  },

  "works-index": {
    id: "works-index",
    label: "Works Index",
    fieldOpacity: "0.5",
    focusedOpacity: "0.72",
    inspectOpacity: "0.84",
    saturation: "0.94",
    contrast: "1",
    blur: "2px",
    scale: "1",
    driftX: "0px",
    driftY: "0px",
    breathDuration: "22s",
    density: "0.3",
    pressure: "0.22",
    calm: "0.82",
  },

  "artist-threshold": {
    id: "artist-threshold",
    label: "Artist Threshold",
    fieldOpacity: "0.62",
    focusedOpacity: "0.78",
    inspectOpacity: "0.86",
    saturation: "1",
    contrast: "1.015",
    blur: "1px",
    scale: "1.014",
    driftX: "-4px",
    driftY: "-2px",
    breathDuration: "18s",
    density: "0.46",
    pressure: "0.4",
    calm: "0.64",
  },

  "artist-statement": {
    id: "artist-statement",
    label: "Artist Statement",
    fieldOpacity: "0.54",
    focusedOpacity: "0.72",
    inspectOpacity: "0.84",
    saturation: "0.92",
    contrast: "1.02",
    blur: "2px",
    scale: "1.005",
    driftX: "0px",
    driftY: "6px",
    breathDuration: "24s",
    density: "0.34",
    pressure: "0.28",
    calm: "0.84",
  },

  "artist-practice": {
    id: "artist-practice",
    label: "Artist Practice Logic",
    fieldOpacity: "0.64",
    focusedOpacity: "0.82",
    inspectOpacity: "0.9",
    saturation: "1.03",
    contrast: "1.025",
    blur: "0px",
    scale: "1.02",
    driftX: "6px",
    driftY: "0px",
    breathDuration: "15s",
    density: "0.58",
    pressure: "0.56",
    calm: "0.42",
  },

  "artist-material": {
    id: "artist-material",
    label: "Artist Material Route",
    fieldOpacity: "0.5",
    focusedOpacity: "0.68",
    inspectOpacity: "0.82",
    saturation: "0.94",
    contrast: "1.01",
    blur: "2px",
    scale: "1",
    driftX: "0px",
    driftY: "0px",
    breathDuration: "22s",
    density: "0.32",
    pressure: "0.3",
    calm: "0.78",
  },
};

export function getSectionAtmosphereState(id?: string): SectionAtmosphereState {
  if (!id) return defaultSectionAtmosphereState;
  return sectionAtmosphereStates[id] ?? defaultSectionAtmosphereState;
}

export type PresenceAtmosphereState = {
  id: string;
  label: string;
  stillness: string;
  depth: string;
  calm: string;
  uiQuiet: string;
  haloBoost: string;
  labelOpacity: string;
  secondaryOpacity: string;
  breathMultiplier: string;
};

export const defaultPresenceAtmosphereState: PresenceAtmosphereState = {
  id: "active",
  label: "Active",
  stillness: "0",
  depth: "0.42",
  calm: "0.42",
  uiQuiet: "0",
  haloBoost: "1",
  labelOpacity: "1",
  secondaryOpacity: "1",
  breathMultiplier: "1",
};

export const presenceAtmosphereStates: Record<string, PresenceAtmosphereState> = {
  active: {
    id: "active",
    label: "Active",
    stillness: "0",
    depth: "0.42",
    calm: "0.42",
    uiQuiet: "0",
    haloBoost: "1",
    labelOpacity: "1",
    secondaryOpacity: "1",
    breathMultiplier: "1",
  },

  settling: {
    id: "settling",
    label: "Settling",
    stillness: "0.35",
    depth: "0.56",
    calm: "0.58",
    uiQuiet: "0.16",
    haloBoost: "1.08",
    labelOpacity: "0.88",
    secondaryOpacity: "0.78",
    breathMultiplier: "1.14",
  },

  still: {
    id: "still",
    label: "Still",
    stillness: "0.72",
    depth: "0.72",
    calm: "0.78",
    uiQuiet: "0.34",
    haloBoost: "1.18",
    labelOpacity: "0.72",
    secondaryOpacity: "0.58",
    breathMultiplier: "1.35",
  },

  deep: {
    id: "deep",
    label: "Deep attention",
    stillness: "1",
    depth: "0.84",
    calm: "0.88",
    uiQuiet: "0.46",
    haloBoost: "1.26",
    labelOpacity: "0.64",
    secondaryOpacity: "0.48",
    breathMultiplier: "1.55",
  },
};

export function getPresenceAtmosphereState(id?: string): PresenceAtmosphereState {
  if (!id) return defaultPresenceAtmosphereState;
  return presenceAtmosphereStates[id] ?? defaultPresenceAtmosphereState;
}

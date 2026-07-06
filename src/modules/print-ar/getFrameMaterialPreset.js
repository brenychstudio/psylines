const FRAME_MATERIAL_PRESETS = Object.freeze([
  {
    id: "matte-black",
    label: "Matte black",
    baseColorHex: "#090a0a",
    faceColorHex: "#090a0a",
    sideColorHex: "#020202",
    roughness: 0.84,
    sideRoughness: 0.92,
    metalness: 0.006,
    clearcoat: 0.035,
    clearcoatRoughness: 0.94,
    contrastMix: 0.12,
    notes: "Deep satin graphite-black with controlled edge sheen and clearer face/side separation.",
  },
  {
    id: "warm-white",
    label: "Warm white",
    baseColorHex: "#efe8dc",
    faceColorHex: "#efe8dc",
    sideColorHex: "#c9bfad",
    roughness: 0.72,
    sideRoughness: 0.86,
    metalness: 0.01,
    clearcoat: 0.09,
    clearcoatRoughness: 0.88,
    contrastMix: 0.08,
    notes: "Warm museum white with painted surface grain and soft side-plane falloff.",
  },
  {
    id: "natural-oak",
    label: "Natural oak",
    baseColorHex: "#9a7145",
    faceColorHex: "#9a7145",
    sideColorHex: "#654429",
    roughness: 0.68,
    sideRoughness: 0.82,
    metalness: 0.01,
    clearcoat: 0.13,
    clearcoatRoughness: 0.76,
    contrastMix: 0.1,
    grainHint: "subtle",
    notes: "Richer restrained oak with deeper side tone and less flat brown-box appearance.",
  },
]);

export const FRAME_MATERIAL_PRESET_IDS = Object.freeze(
  FRAME_MATERIAL_PRESETS.map((preset) => preset.id),
);

export const DEFAULT_FRAME_MATERIAL_PRESET_ID = FRAME_MATERIAL_PRESETS[0].id;

export function getFrameMaterialPreset(
  presetId = DEFAULT_FRAME_MATERIAL_PRESET_ID,
) {
  const normalized = String(presetId || "")
    .trim()
    .toLowerCase();

  return (
    FRAME_MATERIAL_PRESETS.find((preset) => preset.id === normalized) ||
    FRAME_MATERIAL_PRESETS[0]
  );
}

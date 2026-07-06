const FRAME_GEOMETRY_PRESETS = Object.freeze([
  {
    id: "premium-gallery",
    label: "Premium gallery profile",
    profileMode: "gallery-stepped",
    profileWidthMm: 26,
    outerDepthMm: 42,
    frontFaceWidthMm: 15.5,
    sideDepthMm: 16,
    outerBevelMm: 0,
    innerBevelMm: 0,
    bevelSoftness: 0,
    innerLipInsetMm: 5.6,
    innerLipWidthMm: 6.2,
    innerLipDepthMm: 5.4,
    notes: "Deeper premium gallery profile with a visible rabbet and calmer front face.",
  },
]);

export const FRAME_GEOMETRY_PRESET_IDS = Object.freeze(
  FRAME_GEOMETRY_PRESETS.map((preset) => preset.id),
);

export const DEFAULT_FRAME_GEOMETRY_PRESET_ID = FRAME_GEOMETRY_PRESETS[0].id;

export function getFrameGeometryPreset(
  presetId = DEFAULT_FRAME_GEOMETRY_PRESET_ID,
) {
  const normalized = String(presetId || "")
    .trim()
    .toLowerCase();

  return (
    FRAME_GEOMETRY_PRESETS.find((preset) => preset.id === normalized) ||
    FRAME_GEOMETRY_PRESETS[0]
  );
}

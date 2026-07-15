function resolveFrameTone(payload) {
  const value = String(payload?.frame?.style || "").toLowerCase();

  if (value.includes("black")) return "black-frame";
  if (value.includes("white")) return "light-frame";
  if (value.includes("oak")) return "warm-frame";

  return "neutral-frame";
}

export function getAtmosphericBackdropPreset(payload) {
  const frameTone = resolveFrameTone(payload);
  const blackFrameBoost = frameTone === "black-frame";

  return {
    mode: "quiet-museum",
    frameTone,
    baseTop: "#202717",
    baseMid: "#151b12",
    baseBottom: "#0c100d",
    centerGlowColor: blackFrameBoost ? "150, 178, 112" : "132, 154, 108",
    centerGlowOpacity: blackFrameBoost ? 0.36 : 0.28,
    centerGlowSize: blackFrameBoost ? "82%" : "76%",
    centerGlowYOffset: "43%",
    secondaryGlowColor: "84, 104, 68",
    secondaryGlowOpacity: 0.24,
    vignetteStrength: 0.44,
    edgeFalloff: "76%",
    driftOpacity: blackFrameBoost ? 0.14 : 0.1,
    driftBlurPx: 28,
    motionDurationS: 24,
    motionAmplitudePx: blackFrameBoost ? 16 : 12,
  };
}

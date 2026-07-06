import type { StageQuality } from "../core/types";

export const stageQualityPresets: Record<
  StageQuality,
  { dprMax: number; motionEnabled: boolean }
> = {
  high: { dprMax: 1.75, motionEnabled: true },
  medium: { dprMax: 1.4, motionEnabled: true },
  light: { dprMax: 1.15, motionEnabled: true },
  poster: { dprMax: 1, motionEnabled: false },
};

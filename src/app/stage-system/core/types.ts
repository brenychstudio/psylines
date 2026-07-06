export type StageSceneId =
  | "scene-01-iridescent-membrane"
  | "scene-02-monochrome-cloth"
  | "scene-03-intro-gate";

export type StageSceneType = "hero" | "section" | "portal";
export type StageSceneStatus = "approved" | "draft";
export type StageSceneTheme = "dark" | "light" | "auto";
export type StageQuality = "high" | "medium" | "light" | "poster";

export interface StageSceneMeta {
  id: StageSceneId;
  title: string;
  type: StageSceneType;
  status: StageSceneStatus;
  theme: StageSceneTheme;
  visualLanguage: string;
  motionCharacter: string;
  platforms: Array<"web" | "xr">;
  roles: string[];
}

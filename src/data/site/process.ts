export const bodyManifestationProcess = {
  title: "Body Manifestation Process",
  eyebrow: "Process / Technique",
  headline: "The body appears from gesture, not reference.",
  lead:
    "Meta Bodies works are created through an intuitive mixed-media process on paper. A charcoal gesture opens the field, the figure is found inside that field, and the surface is carried through fixation, acrylic membrane, color, and final inner line.",
  shortDefinition:
    "An initial charcoal gesture is made without photographic reference or a pre-planned composition. The emerging figure is identified within the line field, fixed, sealed with transparent acrylic medium, developed through acrylic color, and completed with charcoal-pencil contours or inner structures.",
  publicFormula:
    "Gesture -> trace -> reveal -> body -> field -> code -> presence.",
  compactFormula:
    "Charcoal gesture / fixed trace / acrylic membrane / color field / charcoal-pencil inner structure.",
  mediumLine:
    "Charcoal, acrylic medium, acrylic paint and charcoal pencil on archival paper.",
  simplifiedMedium: "Acrylic and charcoal on archival paper.",
  referencePolicy: "No photographic reference / no pre-planned composition unless noted.",
  processNote:
    "The work begins from an intuitive charcoal line field rather than an external model. The first trace is fixed, carried through an acrylic medium membrane, developed as a color field, and completed with final charcoal-pencil structures.",
};

export const bodyManifestationSteps = [
  {
    title: "Initial gesture",
    label: "Charcoal",
    copy:
      "The work begins with a physical charcoal gesture: lines, stains, pressure, and unstable movement before a body is fully visible.",
  },
  {
    title: "Looking into the field",
    label: "Recognition",
    copy:
      "The artist looks into the marks and searches for a figure, face, body, object, or silhouette already latent inside the line field.",
  },
  {
    title: "Contour reveal",
    label: "Emergence",
    copy:
      "When a presence begins to appear, its contour is strengthened without fully closing the body into a fixed identity.",
  },
  {
    title: "Fixed trace",
    label: "Fixative",
    copy:
      "The unstable charcoal layer is fixed so the first trace remains visible instead of being erased by later material decisions.",
  },
  {
    title: "Acrylic membrane",
    label: "Medium",
    copy:
      "Transparent acrylic medium creates a membrane between the original gesture and the later color field, making the paper denser and more object-like.",
  },
  {
    title: "Color field",
    label: "Acrylic",
    copy:
      "Acrylic color is introduced as pressure, temperature, atmosphere, and memory, not as a decorative background.",
  },
  {
    title: "Return of the line",
    label: "Structure",
    copy:
      "Charcoal pencil returns to the body as contour, code, route, fracture, or inner map rather than descriptive anatomy.",
  },
] as const;

export const bodyManifestationMaterials = [
  {
    material: "Charcoal",
    role: "Primary gesture, unstable line, pressure, stain, and first trace.",
  },
  {
    material: "Fixative",
    role: "Keeps the initial charcoal layer present while later layers enter the surface.",
  },
  {
    material: "Acrylic medium",
    role: "Transparent membrane that strengthens the paper and separates trace from color.",
  },
  {
    material: "Acrylic paint",
    role: "Color as atmosphere, pressure, temperature, and field around the body.",
  },
  {
    material: "Charcoal pencil",
    role: "Final contour, inner route, code, and structural return of the line.",
  },
  {
    material: "Archival paper",
    role: "The carrier of the manifestation: not a passive base, but the surface where layers accumulate.",
  },
] as const;

export const bodyManifestationPrinciples = [
  {
    title: "Not copied",
    copy:
      "The figure is not transferred from a photograph or model. It is found inside the gesture field.",
  },
  {
    title: "Not a sketch",
    copy:
      "Finished works should be described as unique original works on paper or mixed media on archival paper.",
  },
  {
    title: "Not ornament",
    copy:
      "Inner structures do not decorate the body. They replace anatomy with routes, codes, fractures, and memory traces.",
  },
] as const;

export const bodyManifestationMetadata = {
  technique: "Body Manifestation Process",
  primaryGesture: "charcoal gesture / intuitive line field",
  surfaceLayer: "fixed charcoal + transparent acrylic medium",
  colorLayer: "acrylic color field",
  finalLine: "charcoal pencil contour / inner structure",
  reference: bodyManifestationProcess.referencePolicy,
  type: "unique original work on paper",
};

export const whisperXrProcessLinks = [
  {
    physical: "Charcoal gesture",
    spatial: "dark traces, line fields, primary signals",
  },
  {
    physical: "Looking",
    spatial: "gaze / dwell interaction and slow reveal",
  },
  {
    physical: "Acrylic membrane",
    spatial: "transparent layers, projection surfaces, suspended skins",
  },
  {
    physical: "Color field",
    spatial: "atmospheric temperature and spatial state",
  },
  {
    physical: "Inner structures",
    spatial: "routes, codes, traces, and light lines",
  },
] as const;

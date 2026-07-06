import { works } from "../../data/site/works";

export async function buildManifest() {
  const source =
    works.find((item) => item.slug === "mt-3") ?? {
      slug: "mt-3",
      title: "MT-3",
      cover: "/artworks/test-painting-2/mt-3.jpg",
      statement:
        "A quieter vegetal-body emergence, suspended between growth, structure, and signal.",
    };

  return {
    experienceId: "artist-stage-field-of-manifestation",
    schemaVersion: 1,
    zones: [
      {
        id: "manifestation-field",
        label: "Field of Manifestation",
      },
    ],
    artworks: [
      {
        id: "art-mt-3",
        printId: "mt-3",
        zoneId: "manifestation-field",
        src: source.cover,
        title: source.title,
        caption: source.statement,
      },
    ],
    beats: [
      {
        id: "beat-threshold",
        zoneId: "manifestation-field",
        artworkPrintId: "mt-3",
        guidance: { type: "beacon", intensity: 0.36 },
        onGaze: ["reveal"],
        onProximity: ["residue"],
      },
    ],
    collect: {
      mode: "qr",
      shareBasePath: "/works/",
    },
  };
}

export default buildManifest;

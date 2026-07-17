import React from "react";
import type { WorkArchiveEntry } from "./types";

type CuratedGridProps = {
  works: WorkArchiveEntry[];
};

function getAvailabilityLabel(work: WorkArchiveEntry) {
  if (work.availableAsPrint) return "edition route";
  if (work.editionCandidate) return "collector route";
  return "";
}

function getEntryClass(index: number, aspect: WorkArchiveEntry["aspect"]) {
  const classes = ["manifestation-entry", "works-archive-item", `aspect-${aspect}`];

  if (index === 3 || index === 6) classes.push("manifestation-entry--wide");

  return classes.join(" ");
}

function getCycleRegisterLabel(seriesKey: string, seriesTitle: string) {
  if (seriesKey === "meta-bodies-inner-structures") return "Meta Bodies";
  if (seriesKey === "night-water-moonwater") return "Night Water";
  if (seriesKey === "studies-fragments") return "Studies";
  return seriesTitle;
}

export default function CuratedGrid({ works }: CuratedGridProps) {
  return (
    <section className="manifestation-field works-archive-grid" data-view-mode="curated" data-atmosphere-section="works-field">
      {works.map((work, index) => {
        const availabilityLabel = getAvailabilityLabel(work);

        return (
          <a
            key={work.id}
            href={`/works/${work.slug}`}
            className={getEntryClass(index, work.aspect)}
            data-series={work.seriesKey}
            data-edition={work.availableAsPrint ? "true" : "false"}
            data-artwork-slug={work.slug}
            data-atmosphere-handoff-slug={work.slug}
          >
            <div className="manifestation-entry__image works-archive-media">
              {work.coverSrc ? (
                <img
                  src={work.coverSrc}
                  alt={`${work.title} manifestation surface`}
                  className="manifestation-entry__img works-archive-image"
                  loading="lazy"
                  decoding="async"
                  data-cinematic-cover
                />
              ) : (
                <div className="works-archive-surface" data-cinematic-cover />
              )}

              {availabilityLabel ? (
                <div className="manifestation-entry__route works-archive-badge">{availabilityLabel}</div>
              ) : null}
            </div>

            <div className="manifestation-entry__signal works-archive-info">
              <p className="manifestation-entry__kicker works-archive-kicker">
                {getCycleRegisterLabel(work.seriesKey, work.seriesTitle)} / {work.year}
              </p>
              <h2 className="manifestation-entry__title works-archive-title">{work.title}</h2>
              <p className="manifestation-entry__statement works-archive-statement">{work.statement}</p>
            </div>
          </a>
        );
      })}
    </section>
  );
}

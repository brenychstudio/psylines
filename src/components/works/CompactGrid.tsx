import React from "react";
import type { WorkArchiveEntry } from "./types";

type CompactGridProps = {
  works: WorkArchiveEntry[];
};

function getAvailabilityLabel(work: WorkArchiveEntry) {
  if (work.availableAsPrint) return "edition route";
  if (work.editionCandidate) return "collector route";
  return "";
}

function getCycleRegisterLabel(seriesKey: string, seriesTitle: string) {
  if (seriesKey === "meta-bodies-inner-structures") return "Meta Bodies";
  if (seriesKey === "night-water-moonwater") return "Night Water";
  if (seriesKey === "studies-fragments") return "Studies";
  return seriesTitle;
}

export default function CompactGrid({ works }: CompactGridProps) {
  return (
    <section className="works-compact-grid" data-view-mode="compact" data-atmosphere-section="works-index">
      {/* For 100+ works, consider pagination, virtualized index, or year/cycle grouping. */}
      {works.map((work) => {
        const availabilityLabel = getAvailabilityLabel(work);

        return (
          <a
            key={work.id}
            href={`/works/${work.slug}`}
            className={`works-compact-item aspect-${work.aspect}`}
            data-series={work.seriesKey}
            data-edition={work.availableAsPrint ? "true" : "false"}
            data-artwork-slug={work.slug}
            data-atmosphere-handoff-slug={work.slug}
            aria-label={`Enter ${work.title}`}
          >
            <div className="works-compact-media">
              {work.coverSrc ? (
                <img
                  src={work.coverSrc}
                  alt={`${work.title} manifestation surface`}
                  className="works-compact-image"
                  loading="lazy"
                  decoding="async"
                  data-cinematic-cover
                />
              ) : (
                <div className="works-compact-surface" data-cinematic-cover />
              )}

              {availabilityLabel ? <div className="works-archive-badge">{availabilityLabel}</div> : null}
            </div>

            <div className="works-compact-meta">
              <div className="works-compact-year">{work.year}</div>
              <div className="works-compact-title">{work.title}</div>
              <div className="works-compact-cycle">{getCycleRegisterLabel(work.seriesKey, work.seriesTitle)}</div>
            </div>
          </a>
        );
      })}
    </section>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { getCycleAtmosphereMood } from "../../lib/living-atmosphere/workMood";
import CompactGrid from "./CompactGrid";
import CuratedGrid from "./CuratedGrid";
import type { WorkArchiveEntry, WorkFilterItem } from "./types";

type ViewMode = "curated" | "compact";

type WorksArchiveProps = {
  works: WorkArchiveEntry[];
  filterItems: WorkFilterItem[];
};

const FIELD_LIMIT = 9;

function matchesFilter(work: WorkArchiveEntry, activeFilter: string) {
  return (
    activeFilter === "all" ||
    (activeFilter === "editions" && work.availableAsPrint) ||
    activeFilter === work.seriesKey
  );
}

function getCycleRegisterLabel(item: WorkFilterItem) {
  if (item.key === "meta-bodies-inner-structures") return "Meta-Bodies";
  if (item.key === "night-water-moonwater") return "Night Water";
  if (item.key === "studies-fragments") return "Studies";
  return item.label;
}

function getFilterAtmosphereMood(activeFilter: string, filterItems: WorkFilterItem[]) {
  if (activeFilter === "all" || activeFilter === "editions") return "collector";

  const activeItem = filterItems.find((item) => item.key === activeFilter);
  return getCycleAtmosphereMood(`${activeItem?.label ?? ""} ${activeFilter}`);
}

export default function WorksArchive({ works, filterItems }: WorksArchiveProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("curated");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("view");
    const requestedFilter = params.get("filter");

    if (requested === "curated" || requested === "compact") {
      setViewMode(requested);
    }

    const saved = window.localStorage.getItem("worksViewMode");

    if (requested !== "curated" && requested !== "compact" && (saved === "curated" || saved === "compact")) {
      setViewMode(saved);
    }

    if (requestedFilter && filterItems.some((item) => item.key === requestedFilter)) {
      setActiveFilter(requestedFilter);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("worksViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const mood = getFilterAtmosphereMood(activeFilter, filterItems);

    window.dispatchEvent(
      new CustomEvent("artist-stage:atmosphere:set", {
        detail: { mood },
      }),
    );
  }, [activeFilter, filterItems]);

  const filteredWorks = useMemo(
    () => works.filter((work) => matchesFilter(work, activeFilter)),
    [works, activeFilter],
  );
  // Field mode is a curated visual entry surface.
  // Index mode is the scalable archive registry for all works.
  const fieldWorks = filteredWorks.slice(0, FIELD_LIMIT);
  const isCompact = viewMode === "compact";
  const countLabel =
    activeFilter === "all"
      ? `${filteredWorks.length} works in field`
      : `${filteredWorks.length} manifestations in register`;
  const activeFilterItem = filterItems.find((item) => item.key === activeFilter);
  const activeRegisterTitle = activeFilter === "all" ? "All manifestations" : activeFilterItem ? getCycleRegisterLabel(activeFilterItem) : "Active register";
  const activeRegisterNote =
    activeFilter === "all"
      ? `${filteredWorks.length} works in field`
      : `${filteredWorks.length} manifestations`;

  return (
    <>
      <header className={`works-index-header ${isCompact ? "is-compact" : ""}`}>
        <p className="eyebrow">WORKS FIELD</p>
        <div className="works-index-headline-row">
          <div className="works-index-copy">
            <h1 className="works-index-title">
              {isCompact
                ? "Index of manifestations, cycles, editions, and original works."
                : "A field of manifestations, cycles, editions, and original works."}
            </h1>
            {isCompact ? (
              <p className="works-index-text works-index-text-compact">
                Index mode keeps the archive scannable while preserving cycle signals and routes.
              </p>
            ) : (
              <p className="works-index-text">
                Move through works as states, surfaces, and collector routes. Use field mode for the authored visual route or index mode for faster scanning.
              </p>
            )}
          </div>

          <div className="works-index-meta" aria-label="Works field register">
            <p className="works-index-meta-label">FIELD COUNT</p>
            <p className="works-index-count">{filteredWorks.length}</p>
            <p className="works-index-meta-label">{countLabel}</p>
            <div className="works-active-register" aria-live="polite">
              <p className="works-index-meta-label">ACTIVE REGISTER</p>
              <p className="works-active-register-title">{activeRegisterTitle}</p>
              <p className="works-active-register-note">{activeRegisterNote}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="works-filter-bar" aria-label="Works filters">
        {filterItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`works-filter-btn ${activeFilter === item.key ? "is-active" : ""}`}
            onClick={() => setActiveFilter(item.key)}
          >
            {getCycleRegisterLabel(item)}
          </button>
        ))}
      </section>

      <section className="works-view-bar" aria-label="Works view mode">
        <div className="works-view-toggle" role="tablist" aria-label="Works view modes">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "curated"}
            className={`works-view-btn ${viewMode === "curated" ? "is-active" : ""}`}
            onClick={() => setViewMode("curated")}
          >
            Field
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "compact"}
            className={`works-view-btn ${viewMode === "compact" ? "is-active" : ""}`}
            onClick={() => setViewMode("compact")}
          >
            Index
          </button>
        </div>
      </section>

      <p className="works-field-context">
        Field mode shows a curated visual route. Index mode keeps the full archive scannable.
      </p>

      {filteredWorks.length > 0 ? (
        viewMode === "curated" ? <CuratedGrid works={fieldWorks} /> : <CompactGrid works={filteredWorks} />
      ) : null}

      <div className={`works-empty-state ${filteredWorks.length === 0 ? "" : "is-hidden"}`}>
        <p className="works-empty-kicker">No manifestations in this register yet.</p>
        <p className="works-empty-copy">Try another cycle route or return to the full field.</p>
      </div>
    </>
  );
}

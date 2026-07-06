import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  homeLivingCopy,
  homeLivingFieldLayouts,
  type HomeLivingCopyKey,
  type HomeLivingDepth,
  type HomeLivingTone,
} from "../../data/site/homeLivingField";

export type HomeLivingEditorialItem = {
  id: string;
  title: string;
  kicker: string;
  href: string;
  image: string;
  srcset?: string;
  alt: string;
  year: string;
  context: string;
  description: string;
  tone: HomeLivingTone;
  depth: HomeLivingDepth;
  copyKey: HomeLivingCopyKey;
  atmosphereSlug: string;
  atmosphereWash?: string;
  atmosphereGlow?: string;
  atmosphereAccent?: string;
  atmosphereShadow?: string;
};

type Props = {
  items: HomeLivingEditorialItem[];
};

type FocusState = {
  item: HomeLivingEditorialItem;
  source: DOMRect;
  target: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

const depthMotion: Record<HomeLivingDepth, { scale: number; opacity: number; drift: number }> = {
  hero: { scale: 0.115, opacity: 0.28, drift: 1 },
  near: { scale: 0.085, opacity: 0.22, drift: 0.78 },
  mid: { scale: 0.058, opacity: 0.18, drift: 0.55 },
  trace: { scale: 0.038, opacity: 0.14, drift: 0.34 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeTransitionSlug(href: string) {
  return href
    .replace(/^\/+/, "")
    .replace(/[/?#].*$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .toLowerCase();
}

export default function HomeLivingEditorialSurface({ items }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());
  const noteRefs = useRef(new Map<string, HTMLDivElement>());
  const rafId = useRef(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const [activeCopy, setActiveCopy] = useState<HomeLivingCopyKey>("selected");
  const [focusedItem, setFocusedItem] = useState<FocusState | null>(null);
  const [isClosingFocus, setIsClosingFocus] = useState(false);

  const fieldItems = useMemo(
    () =>
      items.map((item, index) => {
        const layout = homeLivingFieldLayouts[index % homeLivingFieldLayouts.length];

        return {
          ...layout,
          ...item,
          depth: item.depth || layout.depth,
          tone: item.tone || layout.tone,
          copyKey: item.copyKey || layout.copyKey,
        };
      }),
    [items],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateTarget = () => {
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetProgress.current = clamp(-rect.top / scrollable, 0, 1);
      if (!rafId.current) rafId.current = window.requestAnimationFrame(render);
    };

    const render = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.08;
      const progress = currentProgress.current;
      let dominantKey: HomeLivingCopyKey = activeCopy;
      let dominantScore = -1;

      fieldItems.forEach((item, index) => {
        const card = cardRefs.current.get(item.id);
        if (!card) return;

        const motion = depthMotion[item.depth];
        const distance = Math.abs(progress - item.focus);
        const emphasis = clamp(1 - distance / 0.22, 0, 1);
        const wave = Math.sin(progress * Math.PI * 4 + index * 0.83) * 0.5 + 0.5;
        const scrollDelta = progress - item.focus;
        const tx = item.driftX * scrollDelta * motion.drift + (wave - 0.5) * 18 * motion.drift;
        const ty = item.driftY * scrollDelta * motion.drift - emphasis * 36 * motion.drift;
        const scale = item.baseScale + emphasis * motion.scale;
        const opacity = clamp(item.baseOpacity + emphasis * motion.opacity - distance * 0.18, 0.22, 1);

        card.style.setProperty("--tx", `${tx.toFixed(2)}px`);
        card.style.setProperty("--ty", `${ty.toFixed(2)}px`);
        card.style.setProperty("--scale", scale.toFixed(4));
        card.style.setProperty("--opacity", opacity.toFixed(3));
        card.style.setProperty("--focus", emphasis.toFixed(3));

        const score = emphasis * (item.depth === "hero" ? 1.24 : item.depth === "near" ? 1 : 0.84);
        if (score > dominantScore) {
          dominantScore = score;
          dominantKey = item.copyKey;
        }

        const note = noteRefs.current.get(item.id);
        if (note) {
          note.style.setProperty("--note-x", `${(tx * 0.32).toFixed(2)}px`);
          note.style.setProperty("--note-y", `${(ty * 0.46).toFixed(2)}px`);
          note.style.setProperty("--note-opacity", `${clamp(emphasis * 1.15, 0.18, 0.82).toFixed(3)}`);
        }
      });

      if (dominantKey !== activeCopy && dominantScore > 0.18) {
        setActiveCopy(dominantKey);
      }

      if (Math.abs(targetProgress.current - currentProgress.current) > 0.001) {
        rafId.current = window.requestAnimationFrame(render);
      } else {
        rafId.current = 0;
      }
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
    };
  }, [activeCopy, fieldItems]);

  const getFocusTarget = (source: DOMRect) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxWidth = Math.min(viewportWidth * 0.34, 560);
    const maxHeight = viewportHeight * 0.78;
    const aspect = source.height / Math.max(1, source.width);
    let width = maxWidth;
    let height = width * aspect;

    if (height > maxHeight) {
      height = maxHeight;
      width = height / aspect;
    }

    return {
      left: viewportWidth * 0.38 - width * 0.5,
      top: viewportHeight * 0.52 - height * 0.5,
      width,
      height,
    };
  };

  const openFocus = (event: React.MouseEvent<HTMLAnchorElement>, item: HomeLivingEditorialItem) => {
    event.preventDefault();
    const image = event.currentTarget.querySelector("img");
    const source = image?.getBoundingClientRect() || event.currentTarget.getBoundingClientRect();
    document.querySelectorAll("[data-home-living-active]").forEach((element) => {
      element.removeAttribute("data-home-living-active");
    });
    event.currentTarget.setAttribute("data-home-living-active", "true");
    setFocusedItem({
      item,
      source,
      target: getFocusTarget(source),
    });
    setIsClosingFocus(false);
    document.documentElement.setAttribute("data-home-focus-open", "true");
  };

  const closeFocus = () => {
    if (isClosingFocus) return;
    setIsClosingFocus(true);
    window.setTimeout(() => {
      setFocusedItem(null);
      setIsClosingFocus(false);
      document.documentElement.removeAttribute("data-home-focus-open");
      document.querySelectorAll("[data-home-living-active]").forEach((element) => {
        element.removeAttribute("data-home-living-active");
      });
    }, 620);
  };

  const openFocusedRoute = () => {
    if (!focusedItem) return;

    try {
      window.sessionStorage.setItem(
        "artist-stage:home-living-field",
        JSON.stringify({
          id: focusedItem.item.id,
          href: focusedItem.item.href,
          title: focusedItem.item.title,
          tone: focusedItem.item.tone,
          at: Date.now(),
        }),
      );
    } catch {
      // Decorative continuity only.
    }

    document.documentElement.setAttribute("data-home-field-leaving", "true");
    window.location.href = focusedItem.item.href;
  };

  useEffect(() => {
    if (!focusedItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFocus();
      if (event.key === "Enter") openFocusedRoute();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedItem]);

  return (
    <section
      ref={rootRef}
      id="selected-manifestations"
      className="home-living-editorial"
      data-home-living-editorial
      data-atmosphere-section="home-living-field"
    >
      <div className="home-living-editorial__atmosphere" aria-hidden="true" />
      <div className="home-living-editorial__grid" aria-hidden="true" />

      <aside className="home-living-copy" aria-live="polite">
        {Object.entries(homeLivingCopy).map(([key, copy]) => (
          <div key={key} className="home-living-copy__state" data-active={activeCopy === key ? "true" : "false"}>
            <p>{copy.kicker}</p>
            <h2>{copy.title}</h2>
            <span>{copy.body}</span>
            <small>{copy.index}</small>
          </div>
        ))}
      </aside>

      <div className="home-living-editorial__spine" aria-hidden="true" />

      <div className="home-living-field" aria-label="Selected manifestations spatial field">
        {fieldItems.map((item, index) => (
          <a
            key={item.id}
            ref={(element) => {
              if (element) cardRefs.current.set(item.id, element);
              else cardRefs.current.delete(item.id);
            }}
            className={`home-living-card home-living-card--${item.depth}`}
            href={item.href}
            style={
              {
                "--top": item.top,
                "--left": item.left,
                "--width": item.width,
                "--z": item.zIndex,
                "--tx": "0px",
                "--ty": "0px",
                "--scale": item.baseScale,
                "--opacity": item.baseOpacity,
                "--focus": "0",
              } as React.CSSProperties
            }
            data-home-living-card
            data-tone={item.tone}
            data-copy-key={item.copyKey}
            data-atmosphere-handoff-slug={item.atmosphereSlug}
            data-artwork-slug={item.id}
            data-cinematic-route-slug={normalizeTransitionSlug(item.href)}
            data-cinematic-manual="true"
            onClick={(event) => openFocus(event, item)}
          >
            <figure>
              <img
                src={item.image}
                srcSet={item.srcset}
                sizes="(min-width: 1200px) 34vw, (min-width: 760px) 44vw, 92vw"
                alt={item.alt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                data-cinematic-cover
                data-cinematic-route-slug={normalizeTransitionSlug(item.href)}
              />
            </figure>
            <div className="home-living-card__caption">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>{item.kicker}</small>
            </div>
          </a>
        ))}
      </div>

      <div className="home-living-notes" aria-hidden="true">
        {fieldItems.slice(0, 5).map((item) => (
          <div
            key={item.id}
            ref={(element) => {
              if (element) noteRefs.current.set(item.id, element);
              else noteRefs.current.delete(item.id);
            }}
            className="home-living-note"
            style={
              {
                "--note-x": "0px",
                "--note-y": "0px",
                "--note-opacity": "0.2",
              } as React.CSSProperties
            }
          >
            {item.context} / {item.year || "field"}
          </div>
        ))}
      </div>

      {focusedItem ? (
        <div
          className="home-living-focus"
          role="dialog"
          aria-modal="true"
          aria-label={`${focusedItem.item.title} preview`}
          data-tone={focusedItem.item.tone}
          data-closing={isClosingFocus ? "true" : "false"}
          style={
            {
              "--focus-wash": focusedItem.item.atmosphereWash,
              "--focus-glow": focusedItem.item.atmosphereGlow,
              "--focus-accent": focusedItem.item.atmosphereAccent,
              "--focus-shadow": focusedItem.item.atmosphereShadow,
              "--focus-image-x": `${focusedItem.target.left + focusedItem.target.width * 0.52}px`,
              "--focus-image-y": `${focusedItem.target.top + focusedItem.target.height * 0.52}px`,
            } as React.CSSProperties
          }
        >
          <button className="home-living-focus__veil" type="button" aria-label="Close preview" onClick={closeFocus} />
          <div className="home-living-focus__tone" aria-hidden="true" />
          <figure
            className="home-living-focus__image"
            style={
              {
                "--from-x": `${focusedItem.source.left - focusedItem.target.left}px`,
                "--from-y": `${focusedItem.source.top - focusedItem.target.top}px`,
                "--from-scale-x": `${focusedItem.source.width / focusedItem.target.width}`,
                "--from-scale-y": `${focusedItem.source.height / focusedItem.target.height}`,
                "--target-left": `${focusedItem.target.left}px`,
                "--target-top": `${focusedItem.target.top}px`,
                "--target-width": `${focusedItem.target.width}px`,
                "--target-height": `${focusedItem.target.height}px`,
              } as React.CSSProperties
            }
          >
            <img src={focusedItem.item.image} srcSet={focusedItem.item.srcset} alt={focusedItem.item.alt} />
          </figure>
          <aside className="home-living-focus__copy">
            <p>{focusedItem.item.kicker}</p>
            <h3>{focusedItem.item.title}</h3>
            <span>{focusedItem.item.description}</span>
            <dl>
              <div>
                <dt>Year</dt>
                <dd>{focusedItem.item.year || "Field"}</dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{focusedItem.item.context}</dd>
              </div>
            </dl>
            <div>
              <button type="button" onClick={openFocusedRoute}>
                Open work
              </button>
              <button type="button" onClick={closeFocus}>
                Return to field
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { ArchitectureStep } from "@/components/home/architectureData";
import styles from "./ArchitectureSection.module.css";

const ARROW_COUNT = 10;

export function ArchitectureSection({
  eyebrow = "",
  heading = "",
  lead = "",
  steps = [],
  appearance,
}: {
  eyebrow?: string;
  heading?: string;
  lead?: string;
  steps?: ArchitectureStep[];
  appearance?: CSSProperties;
} = {}) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [slideMin, setSlideMin] = useState(0);
  const [sideways, setSideways] = useState(false);
  const [pagerPos, setPagerPos] = useState({ top: 0, left: 0 });
  const trackRef = useRef<HTMLDivElement>(null);
  const step = steps[index] ?? steps[0];

  const go = (next: number) => {
    const count = steps.length;
    if (!count) return;
    setIndex((next + count) % count);
  };

  useLayoutEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setSideways(phone.matches);
    };
    update();
    phone.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      phone.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const slides = [...track.children] as HTMLElement[];
      const current = slides[index];
      if (!current) return;
      const heights = slides.map((slide) => {
        const previous = slide.style.minHeight;
        slide.style.minHeight = "0px";
        const height = slide.offsetHeight;
        slide.style.minHeight = previous;
        return height;
      });
      const tallest = Math.max(...heights);
      slides.forEach((slide) => {
        slide.style.minHeight = `${tallest}px`;
      });
      setSlideMin((prev) => (prev === tallest ? prev : tallest));
      const phone = window.matchMedia("(max-width: 767px)").matches;
      setSideways((prev) => (prev === phone ? prev : phone));
      setOffset(phone ? current.offsetLeft : current.offsetTop);
      setSlideHeight(tallest);
      const space = current.querySelector("[data-pager-space]") as HTMLElement | null;
      if (!space) return;
      const spaceRect = space.getBoundingClientRect();
      const slideRect = current.getBoundingClientRect();
      const top = Math.round(spaceRect.top - slideRect.top);
      const left = Math.round(spaceRect.left - slideRect.left);
      setPagerPos((prev) => (prev.top === top && prev.left === left ? prev : { top, left }));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    [...track.children].forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [index, sideways]);

  if (!steps.length || !step) return null;

  return (
    <section className={styles.section} aria-labelledby="architecture-heading" style={appearance}>
      <img className={styles.field} src="/assets/images/architecture/field.png" alt="" />
      <div className={styles.veil} />
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.intro}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            {heading ? (
              <h2 id="architecture-heading" className={styles.heading}>
                {heading}
              </h2>
            ) : null}
          </div>
          <p className={styles.lead}>{lead}</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.diagram}>
            <p className={styles.external}>External Systems</p>
            <ArrowRow />
            <button
              type="button"
              className={`${styles.bar} ${step.id === "machine" ? styles.on : ""}`}
              aria-pressed={step.id === "machine"}
              onClick={() => setIndex(3)}
            >
              Machine Interface
            </button>
            <ArrowRow />
            <div className={`${styles.frame} ${step.id === "trust" ? styles.on : ""}`}>
              <button
                type="button"
                className={styles.frameLabel}
                aria-pressed={step.id === "trust"}
                onClick={() => setIndex(2)}
              >
                Trust & Governance
              </button>
              <div className={styles.pair}>
                <button
                  type="button"
                  className={`${styles.card} ${step.id === "record" ? styles.on : ""}`}
                  aria-pressed={step.id === "record"}
                  onClick={() => setIndex(0)}
                >
                  Verified
                  <br />
                  Record
                </button>
                <img className={styles.link} src="/assets/images/architecture/link.svg" alt="" />
                <button
                  type="button"
                  className={`${styles.card} ${step.id === "network" ? styles.on : ""}`}
                  aria-pressed={step.id === "network"}
                  onClick={() => setIndex(1)}
                >
                  Natural Gas
                  <br />
                  Network Model
                </button>
              </div>
            </div>
          </div>

          <div
            className={styles.viewport}
            style={slideHeight ? { height: `${slideHeight}px` } : undefined}
          >
            <div className={styles.pager} style={{ top: pagerPos.top, left: pagerPos.left }}>
              <button type="button" className={styles.page} onClick={() => go(index - 1)} aria-label="Previous step">
                <img src="/assets/images/architecture/page-prev.svg" alt="" />
              </button>
              <button type="button" className={styles.page} onClick={() => go(index + 1)} aria-label="Next step">
                <img src="/assets/images/architecture/page-next.svg" alt="" />
              </button>
            </div>
            <div
              className={styles.track}
              ref={trackRef}
              style={{
                transform: sideways ? `translateX(-${offset}px)` : `translateY(-${offset}px)`,
              }}
            >
              {steps.map((item, stepIndex) => {
                const place =
                  stepIndex === index ? "current" : stepIndex === index + 1 ? "next" : "later";
                return (
                  <article
                    key={item.id}
                    className={styles.slide}
                    data-place={place}
                    style={slideMin ? { minHeight: slideMin } : undefined}
                  >
                    <div className={styles.indexCol}>
                      <p className={styles.index}>{item.index}</p>
                      <div className={styles.pagerSpace} data-pager-space="" aria-hidden="true" />
                    </div>
                    <div className={styles.copy}>
                      <div className={styles.titles}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.kicker}>{item.kicker}</p>
                      </div>
                      {item.body.map((paragraph) => (
                        <p key={paragraph} className={styles.body}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRow() {
  return (
    <div className={styles.arrows} aria-hidden="true">
      {Array.from({ length: ARROW_COUNT }, (_, arrow) => (
        <span key={arrow} className={styles.arrowSlot}>
          <img className={styles.arrow} src="/assets/images/architecture/arrow.svg" alt="" />
        </span>
      ))}
    </div>
  );
}

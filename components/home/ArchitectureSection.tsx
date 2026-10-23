"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  ARCHITECTURE_EYEBROW,
  ARCHITECTURE_HEADING,
  ARCHITECTURE_LEAD,
  ARCHITECTURE_STEPS,
} from "@/components/home/architectureData";
import styles from "./ArchitectureSection.module.css";

const ARROW_COUNT = 10;

export function ArchitectureSection() {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [slideMin, setSlideMin] = useState(0);
  const [peek, setPeek] = useState(0);
  const [pagerPos, setPagerPos] = useState({ top: 0, left: 0 });
  const trackRef = useRef<HTMLDivElement>(null);
  const step = ARCHITECTURE_STEPS[index];

  const go = (next: number) => {
    const count = ARCHITECTURE_STEPS.length;
    setIndex((next + count) % count);
  };

  useLayoutEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setPeek(query.matches ? 48 : 0);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
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
      setOffset(current.offsetTop);
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
  }, [index]);

  return (
    <section className={styles.section} aria-labelledby="architecture-heading">
      <img className={styles.field} src="/assets/images/architecture/field.png" alt="" />
      <div className={styles.veil} />
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{ARCHITECTURE_EYEBROW}</p>
            <h2 id="architecture-heading" className={styles.heading}>
              {ARCHITECTURE_HEADING}
            </h2>
          </div>
          <p className={styles.lead}>{ARCHITECTURE_LEAD}</p>
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
            style={slideHeight ? { height: `${slideHeight + peek}px` } : undefined}
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
              style={{ transform: `translateY(-${offset}px)` }}
            >
              {ARCHITECTURE_STEPS.map((item, stepIndex) => {
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

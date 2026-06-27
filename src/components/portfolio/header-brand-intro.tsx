"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ResumeContent } from "@/content";

type HeaderBrandIntroProps = {
  intro: ResumeContent["profile"]["headerIntro"];
  href: string;
  name: string;
};

type HeaderAvatarTone = "initials" | "silhouette";

const avatarIntervalMs = 9000;
const lineIntervalMs = 3200;
const lineTextShadow =
  "0 1px 2px rgba(23, 35, 53, 0.14), 0 1px 0 rgba(255, 255, 255, 0.72)";

const avatarSlides = [
  { key: "silhouette", tone: "silhouette" },
  { key: "initials", tone: "initials" },
] satisfies Array<{ key: string; tone: HeaderAvatarTone }>;

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "YN";
}

function NeutralHeaderAvatar({
  initials,
  tone,
}: {
  initials: string;
  tone: HeaderAvatarTone;
}) {
  if (tone === "initials") {
    return (
      <span className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,rgba(247,243,234,1),rgba(215,225,222,1))]">
        <span
          aria-hidden="true"
          className="grid h-[68%] w-[68%] place-items-center rounded-full bg-[rgba(53,67,87,0.9)] text-[0.64rem] font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(23,35,53,0.16)]"
        >
          {initials}
        </span>
      </span>
    );
  }

  return (
    <span className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,rgba(238,233,224,1),rgba(207,218,223,1))]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 80 80"
      >
        <circle cx="40" cy="28" r="15" fill="rgba(78,92,112,0.96)" />
        <path
          d="M27 27c4-13 13-18 25-15 8 2 14 10 14 20-9-4-18-5-29-4-4 0-7 0-10-1z"
          fill="rgba(47,61,80,0.96)"
        />
        <path
          d="M16 80c1-26 11-39 24-39s23 13 24 39z"
          fill="rgba(47,61,80,0.94)"
        />
        <path
          d="M23 60c6-10 15-16 27-17-7 7-11 19-12 37H17c0-7 2-14 6-20z"
          fill="rgba(96,110,126,0.48)"
        />
        <path
          d="M34 35c4 3 9 3 14 0"
          fill="none"
          stroke="rgba(240,236,228,0.58)"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

export function HeaderBrandIntro({
  href,
  intro,
  name,
}: HeaderBrandIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lines = useMemo(
    () => (intro.lines.length > 0 ? intro.lines : [name]),
    [intro.lines, name]
  );
  const initials = getInitials(name);
  const activeLine = lines[activeLineIndex % lines.length];

  useEffect(() => {
    if (shouldReduceMotion || isPaused || avatarSlides.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveAvatarIndex((current) => (current + 1) % avatarSlides.length);
    }, avatarIntervalMs);

    return () => window.clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || isPaused || lines.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveLineIndex((current) => (current + 1) % lines.length);
    }, lineIntervalMs);

    return () => window.clearInterval(interval);
  }, [isPaused, lines.length, shouldReduceMotion]);

  return (
    <div
      className="relative flex min-w-0 flex-1 sm:flex-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        href={href}
        aria-label={intro.ariaLabel}
        className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-full pr-2 text-left text-[color:var(--folio-ink)] transition-colors duration-200 ease-out hover:text-[color:var(--folio-accent-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--folio-accent-2)] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
      >
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/80 shadow-[0_10px_24px_rgba(23,35,53,0.1)] ring-1 ring-[color:var(--folio-line)]">
          {avatarSlides.map((slide, index) => (
            <motion.span
              key={slide.key}
              className="absolute inset-0"
              animate={{
                opacity:
                  index === activeAvatarIndex % avatarSlides.length ? 1 : 0,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2.4, ease: "easeInOut" }
              }
              aria-hidden="true"
            >
              <NeutralHeaderAvatar initials={initials} tone={slide.tone} />
            </motion.span>
          ))}
        </span>

        <span className="relative block h-5 w-[min(34vw,13.25rem)] min-w-0 overflow-hidden text-sm font-semibold leading-5 text-[color:var(--folio-ink)] sm:w-[11rem] md:w-[12.5rem] lg:w-[16.5rem]">
          {shouldReduceMotion ? (
            <span className="block truncate" style={{ textShadow: lineTextShadow }}>
              {activeLine}
            </span>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeLine}
                initial={{ opacity: 0, y: 9, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -9, filter: "blur(4px)" }}
                transition={{ duration: 0.34, ease: [0.16, 0.86, 0.2, 1] }}
                className="absolute inset-x-0 top-0 block truncate text-[color:var(--folio-ink)] transition-colors duration-200 ease-out group-hover:text-[color:var(--folio-accent-2)]"
                style={{ textShadow: lineTextShadow }}
              >
                {activeLine}
              </motion.span>
            </AnimatePresence>
          )}
        </span>
      </Link>
    </div>
  );
}

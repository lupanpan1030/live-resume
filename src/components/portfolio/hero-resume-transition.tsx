"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { HeroExperienceOrbitMode } from "@/components/portfolio/hero-experience-orbit";
import { PortfolioHeroStageCard } from "@/components/portfolio/portfolio-hero-stage-card";
import deskAsset from "@/assets/hero/table.png";
import keyboardAsset from "@/assets/hero/keyboard.png";
import monitorFrameAsset from "@/assets/hero/monitor-frame.png";
import mouseAsset from "@/assets/hero/mouse.png";
import type { DownloadAsset, ResumeContent } from "@/content";

type HeroResumeTransitionProps = {
  cvDownload: DownloadAsset;
  profile: ResumeContent["profile"];
};

type SeatedCharacterFigureProps = {
  animateHands?: boolean;
};

const transitionSceneLabel = "Portfolio transition scene";

const landingMomentumLockDuration = 1800;
const landingMomentumExtendDuration = 700;
const landingMomentumMaxDuration = 3600;
const transitionForwardAutoplayMinDuration = 1900;
const transitionForwardAutoplayMaxDuration = 2600;
const transitionForwardAutoplayDistanceFactor = 0.52;
const transitionReverseAutoplayMinDuration = 2300;
const transitionReverseAutoplayMaxDuration = 3200;
const transitionReverseAutoplayDistanceFactor = 0.64;
const resumeReverseTriggerBeforeViewportBuffer = 0.9;
const resumeReverseTriggerAfterViewportBuffer = 0.22;
const transitionSceneWidth = 1392;
const transitionSceneHeight = 832;
const transitionSceneGutterX = 32;
const transitionSceneGutterY = 24;

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const getResumeLandingElement = () =>
  document.getElementById("portfolio-resume") ??
  document.getElementById("portfolio-content");

function getTransitionAutoplayDuration(distance: number) {
  const isReverse = distance < 0;
  const minDuration = isReverse
    ? transitionReverseAutoplayMinDuration
    : transitionForwardAutoplayMinDuration;
  const maxDuration = isReverse
    ? transitionReverseAutoplayMaxDuration
    : transitionForwardAutoplayMaxDuration;
  const distanceFactor = isReverse
    ? transitionReverseAutoplayDistanceFactor
    : transitionForwardAutoplayDistanceFactor;

  return Math.min(
    maxDuration,
    Math.max(minDuration, Math.abs(distance) * distanceFactor)
  );
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function SeatedCharacterFigure({
  animateHands = false,
}: SeatedCharacterFigureProps) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className="absolute bottom-[5.4rem] right-[2.4rem] z-10 h-[3.1rem] w-[10.6rem] rounded-full bg-[rgba(23,35,53,0.1)] blur-[12px]"
      >
      </div>
      <svg
        className="absolute bottom-[4.55rem] right-[0.65rem] z-20 h-[24.5rem] w-[20rem] overflow-visible drop-shadow-[0_24px_42px_rgba(23,35,53,0.12)]"
        viewBox="0 0 260 330"
      >
        <ellipse cx="136" cy="301" rx="64" ry="15" fill="rgba(23,35,53,0.12)" />
        <path
          d="M83 238c-14 22-21 45-18 64 16 8 36 7 49-3 2-31 10-55 24-72z"
          fill="rgba(42,56,76,0.94)"
        />
        <path
          d="M150 227c16 17 25 40 29 70 13 9 32 10 48 2 2-24-8-50-31-78z"
          fill="rgba(32,44,62,0.94)"
        />
        <motion.g
          animate={
            animateHands
              ? {
                  rotate: [-34, -38, -36, -39, -34],
                }
              : undefined
          }
          transition={{
            duration: 2.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{ transformBox: "fill-box", transformOrigin: "55% 12%" }}
        >
          <path
            d="M91 150c-28 24-46 57-47 97 9 8 23 9 34 3 7-31 19-57 39-77z"
            fill="rgba(82,96,116,0.91)"
          />
          <ellipse cx="59" cy="249" rx="17" ry="10" fill="rgba(103,116,134,0.92)" />
        </motion.g>
        <motion.g
          animate={
            animateHands
              ? {
                  rotate: [0, -5, -2, 0],
                }
              : undefined
          }
          transition={{
            duration: 5.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
          style={{ transformBox: "fill-box", transformOrigin: "48% 11%" }}
        >
          <path
            d="M172 148c27 21 47 50 55 85-7 11-21 16-34 12-11-26-26-50-47-70z"
            fill="rgba(90,104,122,0.9)"
          />
          <ellipse cx="212" cy="237" rx="17" ry="10" fill="rgba(111,124,141,0.92)" />
        </motion.g>
        <path
          d="M98 128c17-13 58-15 76 0 22 19 32 67 25 111-22 20-83 22-115 2-7-44-6-91 14-113z"
          fill="rgba(45,59,79,0.97)"
        />
        <path
          d="M102 132c18 18 30 31 30 99-18-7-31-22-39-40-1-24 2-43 9-59z"
          fill="rgba(82,96,116,0.56)"
        />
        <path
          d="M118 113c11 10 31 9 43-1l3 25c-12 12-38 13-51 1z"
          fill="rgba(108,121,138,0.94)"
        />
        <circle cx="140" cy="75" r="41" fill="rgba(104,117,134,0.98)" />
        <path
          d="M105 66c9-28 27-41 55-36 20 4 35 21 36 45-18-7-38-9-61-7-12 1-21 0-30-2z"
          fill="rgba(54,68,88,0.96)"
        />
        <path
          d="M122 85c12 8 25 9 39 0"
          fill="none"
          stroke="rgba(233,229,221,0.5)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M94 244c31 20 78 20 104-2"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
    </div>
  );
}

function resolveTransitionSceneScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  const viewport = window.visualViewport;
  const viewportWidth = viewport?.width ?? window.innerWidth;
  const viewportHeight = viewport?.height ?? window.innerHeight;
  const widthScale =
    (viewportWidth - transitionSceneGutterX) / transitionSceneWidth;
  const heightScale =
    (viewportHeight - transitionSceneGutterY) / transitionSceneHeight;

  return Math.min(1, Math.max(0.1, Math.min(widthScale, heightScale)));
}

function useTransitionSceneScale() {
  const [sceneScale, setSceneScale] = useState(1);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let frameId: number | null = null;

    const updateScale = () => {
      frameId = null;
      setSceneScale(resolveTransitionSceneScale());
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateScale);
    };

    updateScale();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return sceneScale;
}

function ReducedMotionScene({
  cvDownload,
  profile,
}: HeroResumeTransitionProps) {
  const sceneScale = useTransitionSceneScale();

  return (
    <section
      id="portfolio-transition"
      aria-label={transitionSceneLabel}
      className="relative overflow-hidden"
    >
      <div className="relative h-[100svh] min-h-[42rem]">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            height: transitionSceneHeight,
            transform: "translate3d(-50%, -50%, 0)",
            width: transitionSceneWidth,
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transform: `scale(${sceneScale})`,
              transformOrigin: "center center",
            }}
          >
          <div className="absolute left-1/2 top-[56%] h-[1.8rem] w-[22rem] -translate-x-1/2 rounded-full bg-[rgba(15,23,42,0.12)] blur-[18px]" />

            <div
              className="absolute inset-0 [perspective:1700px]"
              style={{
                transform: "translateY(clamp(-18rem, -20svh, -10.4rem))",
              }}
            >
              <div className="absolute left-[calc(50%-5.25rem)] top-[54.9%] h-[27.7rem] w-[31.2rem] -translate-x-1/2 -translate-y-1/2">
                <div
                  className="absolute overflow-hidden rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(251,248,242,0.98),rgba(243,239,232,0.96))] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.05)]"
                  style={{ top: "3.5%", left: "2.9%", right: "3%", bottom: "29.7%" }}
                >
                  <div className="absolute left-1/2 top-1/2 w-[81rem] -translate-x-1/2 -translate-y-1/2 scale-[0.358]">
                    <PortfolioHeroStageCard
                      cvDownload={cvDownload}
                      decorative
                      profile={profile}
                      variant="hero"
                    />
                  </div>
                </div>
                <Image
                  src={monitorFrameAsset}
                  alt=""
                  fill
                  sizes="608px"
                  className="pointer-events-none object-contain select-none"
                />
              </div>

              <div className="absolute left-1/2 top-[72.8%] h-[9.5rem] w-[86rem] -translate-x-1/2">
                <div className="absolute left-1/2 top-[0.6rem] h-[3.4rem] w-[72rem] -translate-x-1/2 rounded-full bg-[rgba(188,144,90,0.12)] blur-[18px]" />
                <Image
                  src={deskAsset}
                  alt=""
                  fill
                  sizes="1312px"
                  className="pointer-events-none object-contain saturate-[1.12] contrast-[1.04] drop-shadow-[0_18px_28px_rgba(105,78,42,0.08)] select-none"
                />
                <div className="absolute left-[49.2%] top-[2.78rem] h-[3.5rem] w-[29.6rem] -translate-x-1/2">
                  <Image
                    src={keyboardAsset}
                    alt=""
                    fill
                    sizes="474px"
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
                <div className="absolute left-[63.8%] top-[3.18rem] h-[2.15rem] w-[5.15rem]">
                  <Image
                    src={mouseAsset}
                    alt=""
                    fill
                    sizes="82px"
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </div>

              <div
                className="absolute bottom-[-4%] right-[-0.5rem] h-[26.8rem] w-[21.9rem]"
                style={{
                  transform: "translate3d(0, -4.6rem, 0) scale(1.12)",
                  transformOrigin: "right bottom",
                }}
              >
                <SeatedCharacterFigure />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactHeroScene({
  cvDownload,
  profile,
  constellationMode = "auto",
}: HeroResumeTransitionProps & {
  constellationMode?: HeroExperienceOrbitMode;
}) {
  return (
    <section
      aria-label={transitionSceneLabel}
      className="relative z-10 px-4 pb-8 pt-4 sm:px-6 lg:px-8 xl:hidden"
    >
      <div className="mx-auto max-w-5xl">
        <PortfolioHeroStageCard
          constellationMode={constellationMode}
          cvDownload={cvDownload}
          profile={profile}
          showEntranceAnimation
          variant="hero"
        />
      </div>
    </section>
  );
}

export function HeroResumeTransition({
  cvDownload,
  profile,
}: HeroResumeTransitionProps) {
  const dockedCardScale = 0.358;
  const sceneScale = useTransitionSceneScale();
  const sectionRef = useRef<HTMLElement>(null);
  const previewOriginRef = useRef<HTMLDivElement>(null);
  const screenTargetRef = useRef<HTMLDivElement>(null);
  const dockMeasureRafRef = useRef<number | null>(null);
  const transitionAutoplayRafRef = useRef<number | null>(null);
  const transitionLandingHoldRafRef = useRef<number | null>(null);
  const transitionAutoplayActiveRef = useRef(false);
  const transitionLandingYRef = useRef<number | null>(null);
  const transitionMomentumLockUntilRef = useRef(0);
  const transitionMomentumLockMaxUntilRef = useRef(0);
  const transitionTouchStartYRef = useRef<number | null>(null);
  const constellationModeRef = useRef<HeroExperienceOrbitMode>("auto");
  const [constellationMode, setConstellationMode] =
    useState<HeroExperienceOrbitMode>("auto");
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.22,
  });

  const dockTargetScale = useMotionValue(dockedCardScale);
  const dockTargetX = useMotionValue(0);
  const dockTargetY = useMotionValue(34);

  const updateConstellationMode = useCallback(
    (nextMode: HeroExperienceOrbitMode) => {
      if (constellationModeRef.current === nextMode) {
        return;
      }

      constellationModeRef.current = nextMode;
      setConstellationMode(nextMode);
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      updateConstellationMode("idle");
    }, 6200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [shouldReduceMotion, updateConstellationMode]);

  const measureDockTarget = useCallback(() => {
    const previewOrigin = previewOriginRef.current;
    const screenTarget = screenTargetRef.current;

    if (!previewOrigin || !screenTarget) {
      return;
    }

    const previewRect = previewOrigin.getBoundingClientRect();
    const screenRect = screenTarget.getBoundingClientRect();

    if (
      previewRect.width < 1 ||
      previewRect.height < 1 ||
      screenRect.width < 1 ||
      screenRect.height < 1
    ) {
      return;
    }

    const previewCenterX = previewRect.left + previewRect.width / 2;
    const previewCenterY = previewRect.top + previewRect.height / 2;
    const screenCenterX = screenRect.left + screenRect.width / 2;
    const screenCenterY = screenRect.top + screenRect.height / 2;

    dockTargetScale.set(screenRect.width / previewRect.width);
    dockTargetX.set(screenCenterX - previewCenterX);
    dockTargetY.set(screenCenterY - previewCenterY);
  }, [dockTargetScale, dockTargetX, dockTargetY]);

  const scheduleDockMeasure = useCallback(() => {
    if (typeof window === "undefined" || dockMeasureRafRef.current !== null) {
      return;
    }

    dockMeasureRafRef.current = window.requestAnimationFrame(() => {
      dockMeasureRafRef.current = null;
      measureDockTarget();
    });
  }, [measureDockTarget]);

  useEffect(() => {
    scheduleDockMeasure();
  }, [sceneScale, scheduleDockMeasure]);

  useEffect(() => {
    const previewOrigin = previewOriginRef.current;
    const screenTarget = screenTargetRef.current;

    scheduleDockMeasure();

    if (!previewOrigin || !screenTarget) {
      return;
    }

    const observer = new ResizeObserver(() => {
      scheduleDockMeasure();
    });

    observer.observe(previewOrigin);
    observer.observe(screenTarget);
    window.addEventListener("resize", scheduleDockMeasure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleDockMeasure);

      if (dockMeasureRafRef.current !== null) {
        window.cancelAnimationFrame(dockMeasureRafRef.current);
        dockMeasureRafRef.current = null;
      }
    };
  }, [scheduleDockMeasure]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest <= 0.48) {
      scheduleDockMeasure();
    }

    if (latest > 0.015 && latest < 0.24) {
      updateConstellationMode("transition");
      return;
    }

    if (constellationModeRef.current === "transition") {
      updateConstellationMode("idle");
    }
  });

  const clearTransitionLandingHold = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (transitionLandingHoldRafRef.current !== null) {
      window.cancelAnimationFrame(transitionLandingHoldRafRef.current);
      transitionLandingHoldRafRef.current = null;
    }

    transitionLandingYRef.current = null;
    transitionMomentumLockUntilRef.current = 0;
    transitionMomentumLockMaxUntilRef.current = 0;
  }, []);

  const cancelTransitionAutoplay = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (transitionAutoplayRafRef.current !== null) {
      window.cancelAnimationFrame(transitionAutoplayRafRef.current);
      transitionAutoplayRafRef.current = null;
    }

    transitionAutoplayActiveRef.current = false;
    clearTransitionLandingHold();
  }, [clearTransitionLandingHold]);

  const clampTransitionLanding = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const landingY = transitionLandingYRef.current;

    if (landingY === null || window.scrollY <= landingY) {
      return;
    }

    window.scrollTo({
      top: landingY,
      behavior: "instant",
    });
  }, []);

  const holdTransitionLanding = useCallback((targetY: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const now = window.performance.now();

    transitionLandingYRef.current = targetY;
    transitionMomentumLockUntilRef.current = now + landingMomentumLockDuration;
    transitionMomentumLockMaxUntilRef.current =
      now + landingMomentumMaxDuration;

    if (transitionLandingHoldRafRef.current !== null) {
      window.cancelAnimationFrame(transitionLandingHoldRafRef.current);
      transitionLandingHoldRafRef.current = null;
    }

    const hold = () => {
      if (window.performance.now() >= transitionMomentumLockUntilRef.current) {
        transitionLandingHoldRafRef.current = null;
        return;
      }

      clampTransitionLanding();

      transitionLandingHoldRafRef.current = window.requestAnimationFrame(hold);
    };

    transitionLandingHoldRafRef.current = window.requestAnimationFrame(hold);
  }, [clampTransitionLanding]);

  const extendTransitionMomentumLock = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const now = window.performance.now();
    const maxUntil = transitionMomentumLockMaxUntilRef.current;

    if (now >= maxUntil) {
      return;
    }

    transitionMomentumLockUntilRef.current = Math.min(
      Math.max(
        transitionMomentumLockUntilRef.current,
        now + landingMomentumExtendDuration
      ),
      maxUntil
    );
  }, []);

  const isAtTransitionHeroStart = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const section = sectionRef.current;
    const resumeLanding = getResumeLandingElement();

    if (!section || !resumeLanding) {
      return false;
    }

    if (window.getComputedStyle(section).display === "none") {
      return false;
    }

    const sectionTop = section.offsetTop;
    const resumeTop = resumeLanding.getBoundingClientRect().top + window.scrollY;
    const currentY = window.scrollY;
    const triggerEnd = Math.min(
      sectionTop + window.innerHeight * 0.55,
      resumeTop - window.innerHeight * 0.4
    );

    return currentY >= sectionTop - 2 && currentY <= triggerEnd;
  }, []);

  const isAtTransitionResumeStart = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const section = sectionRef.current;
    const resumeLanding = getResumeLandingElement();

    if (!section || !resumeLanding) {
      return false;
    }

    if (window.getComputedStyle(section).display === "none") {
      return false;
    }

    const resumeTop = resumeLanding.getBoundingClientRect().top + window.scrollY;
    const currentY = window.scrollY;
    const triggerBefore = Math.max(
      160,
      window.innerHeight * resumeReverseTriggerBeforeViewportBuffer
    );
    const triggerAfter = Math.max(
      72,
      window.innerHeight * resumeReverseTriggerAfterViewportBuffer
    );

    return (
      currentY >= resumeTop - triggerBefore &&
      currentY <= resumeTop + triggerAfter
    );
  }, []);

  const playTransitionScroll = useCallback(
    (targetY: number, onComplete?: () => void) => {
      if (
        typeof window === "undefined" ||
        transitionAutoplayActiveRef.current
      ) {
        return false;
      }

      const startY = window.scrollY;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const clampedTargetY = Math.min(Math.max(targetY, 0), maxY);
      const distance = clampedTargetY - startY;

      if (Math.abs(distance) <= 24) {
        return false;
      }

      clearTransitionLandingHold();
      transitionAutoplayActiveRef.current = true;

      const startTime = window.performance.now();
      const duration = getTransitionAutoplayDuration(distance);

      const step = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(t);

        window.scrollTo({
          top: startY + distance * eased,
          behavior: "instant",
        });

        if (t < 1) {
          transitionAutoplayRafRef.current = window.requestAnimationFrame(step);
          return;
        }

        transitionAutoplayRafRef.current = null;
        transitionAutoplayActiveRef.current = false;
        window.scrollTo({
          top: clampedTargetY,
          behavior: "instant",
        });
        onComplete?.();
      };

      transitionAutoplayRafRef.current = window.requestAnimationFrame(step);
      return true;
    },
    [clearTransitionLandingHold]
  );

  const playTransitionToResume = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const resumeLanding = getResumeLandingElement();

    if (!resumeLanding) {
      return false;
    }

    const startY = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.min(
      resumeLanding.getBoundingClientRect().top + startY,
      maxY
    );

    return playTransitionScroll(targetY, () => {
      holdTransitionLanding(targetY);
    });
  }, [holdTransitionLanding, playTransitionScroll]);

  const playTransitionToHero = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const section = sectionRef.current;

    if (!section) {
      return false;
    }

    return playTransitionScroll(section.offsetTop);
  }, [playTransitionScroll]);

  const shouldBlockTransitionMomentum = useCallback((direction: number) => {
    if (typeof window === "undefined" || direction === 0) {
      return false;
    }

    if (transitionAutoplayActiveRef.current) {
      return true;
    }

    if (direction <= 0) {
      return false;
    }

    const shouldBlock =
      window.performance.now() < transitionMomentumLockUntilRef.current;

    if (shouldBlock) {
      extendTransitionMomentumLock();
      clampTransitionLanding();
    }

    return shouldBlock;
  }, [clampTransitionLanding, extendTransitionMomentumLock]);

  const handleTransitionAutoplayIntent = useCallback(
    (direction: number) => {
      if (direction === 0) {
        return false;
      }

      if (shouldBlockTransitionMomentum(direction)) {
        return true;
      }

      if (direction > 0) {
        if (!isAtTransitionHeroStart()) {
          return false;
        }

        return playTransitionToResume();
      }

      if (!isAtTransitionResumeStart()) {
        return false;
      }

      return playTransitionToHero();
    },
    [
      isAtTransitionHeroStart,
      isAtTransitionResumeStart,
      playTransitionToHero,
      playTransitionToResume,
      shouldBlockTransitionMomentum,
    ]
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      if (shouldBlockTransitionMomentum(event.deltaY)) {
        event.preventDefault();
        return;
      }

      const minimumDelta = event.deltaY < 0 ? 1 : 6;

      if (Math.abs(event.deltaY) < minimumDelta) {
        return;
      }

      if (handleTransitionAutoplayIntent(event.deltaY)) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      transitionTouchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const startY = transitionTouchStartYRef.current;
      const currentY = event.touches[0]?.clientY;

      if (startY === null || currentY === undefined) {
        return;
      }

      const deltaY = startY - currentY;

      if (Math.abs(deltaY) < 14) {
        return;
      }

      if (shouldBlockTransitionMomentum(deltaY)) {
        event.preventDefault();
        return;
      }

      if (handleTransitionAutoplayIntent(deltaY)) {
        event.preventDefault();
      }
    };

    const handleScroll = () => {
      if (
        window.performance.now() < transitionMomentumLockUntilRef.current
      ) {
        clampTransitionLanding();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return;
      }

      const direction =
        event.key === "ArrowUp" || event.key === "PageUp"
          ? -1
          : event.key === "ArrowDown" ||
              event.key === "PageDown" ||
              event.key === " " ||
              event.key === "Spacebar"
            ? 1
            : 0;

      if (handleTransitionAutoplayIntent(direction)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      cancelTransitionAutoplay();
    };
  }, [
    cancelTransitionAutoplay,
    clampTransitionLanding,
    handleTransitionAutoplayIntent,
    shouldBlockTransitionMomentum,
    shouldReduceMotion,
  ]);

  const stageOpacity = useTransform(progress, [0.22, 0.3, 0.94, 1], [0, 1, 1, 0]);
  const previewDockProgress = useTransform(
    progress,
    [0, 0.03, 0.08, 0.16, 0.26, 1],
    [0, 0.12, 0.42, 0.8, 1, 1]
  );
  const previewOpacity = useTransform(progress, [0, 0.2, 0.24, 0.29], [1, 1, 0.12, 0]);
  const previewScale = useTransform(
    [previewDockProgress, dockTargetScale],
    (values) => {
      const [dock, targetScale] = values as number[];
      return 1 + (targetScale - 1) * dock;
    }
  );
  const previewX = useTransform(
    [previewDockProgress, dockTargetX],
    (values) => {
      const [dock, targetX] = values as number[];
      return targetX * dock;
    }
  );
  const previewY = useTransform(
    [previewDockProgress, dockTargetY],
    (values) => {
      const [dock, targetY] = values as number[];
      return targetY * dock;
    }
  );
  const previewRadius = useTransform(
    previewDockProgress,
    [0, 0.3, 0.7, 1],
    ["2.2rem", "1.92rem", "1.48rem", "1.04rem"]
  );
  const previewShadow = useTransform(
    previewDockProgress,
    [0, 0.3, 0.72, 1],
    [
      "0 26px 80px rgba(23,35,53,0.1)",
      "0 24px 62px rgba(23,35,53,0.14)",
      "0 22px 54px rgba(23,35,53,0.16)",
      "0 8px 22px rgba(15,23,42,0.18)",
    ]
  );

  const monitorOpacity = useTransform(progress, [0, 0.02, 0.08, 0.18], [0, 0.12, 0.82, 1]);
  const monitorScale = useTransform(
    progress,
    [0, 0.03, 0.08, 0.16, 0.28, 0.46, 1],
    [2.24, 2.1, 1.82, 1.44, 1.18, 1.05, 1]
  );
  const monitorX = useTransform(progress, [0.72, 1], [0, -6]);
  const monitorY = useTransform(progress, [0, 0.04, 0.12, 0.26, 0.46, 1], [96, 84, 68, 52, 44, 46]);
  const screenCardOpacity = useTransform(progress, [0.18, 0.24, 0.32, 1], [0, 0.34, 1, 1]);
  const screenCardScale = useTransform(progress, [0, 1], [dockedCardScale, dockedCardScale]);
  const screenViewportOverlayOpacity = useTransform(progress, [0.22, 0.34, 0.48], [0, 0.26, 0.5]);
  const monitorShadowOpacity = useTransform(progress, [0.22, 0.34, 0.56], [0, 0.1, 0.2]);
  const monitorShadowScale = useTransform(progress, [0.22, 0.42, 1], [0.82, 0.98, 1.06]);

  const deskOpacity = useTransform(progress, [0.08, 0.16, 0.24], [0, 0.92, 1]);
  const deskScale = useTransform(progress, [0.08, 0.22, 1], [0.94, 1, 1]);
  const deskY = useTransform(progress, [0.08, 0.22, 1], [28, 0, 0]);

  const figureOpacity = useTransform(progress, [0.14, 0.28, 0.92], [0, 1, 1]);
  const figureX = useTransform(progress, [0.14, 0.34, 1], [142, 10, 0]);
  const figureY = useTransform(progress, [0.14, 0.34, 1], [64, -74, -74]);

  if (shouldReduceMotion) {
    return (
      <>
        <CompactHeroScene
          cvDownload={cvDownload}
          constellationMode="idle"
          profile={profile}
        />
        <div className="hidden xl:block">
          <ReducedMotionScene cvDownload={cvDownload} profile={profile} />
        </div>
      </>
    );
  }

  return (
    <>
      <CompactHeroScene
        cvDownload={cvDownload}
        constellationMode={constellationMode}
        profile={profile}
      />
      <section
        id="portfolio-transition"
        ref={sectionRef}
        className="relative z-50 hidden h-[360vh] xl:block"
        aria-label={transitionSceneLabel}
      >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            height: transitionSceneHeight,
            transform: "translate3d(-50%, -50%, 0)",
            width: transitionSceneWidth,
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transform: `scale(${sceneScale})`,
              transformOrigin: "center center",
            }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: stageOpacity }}
              aria-hidden="true"
            >
              <div className="absolute left-1/2 top-[62%] h-[24rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,249,242,0.48)] blur-3xl" />
            </motion.div>

            <div className="pointer-events-none relative h-full w-full">
            <div
              ref={previewOriginRef}
              className="pointer-events-auto absolute left-1/2 top-1/2 w-[84rem] -translate-x-1/2 -translate-y-1/2 [perspective:1700px]"
              style={{ zIndex: 20 }}
            >
              <motion.div
                className="relative z-10 w-full overflow-visible"
                style={{
                  opacity: previewOpacity,
                  x: previewX,
                  y: previewY,
                  scale: previewScale,
                  borderRadius: previewRadius,
                  boxShadow: previewShadow,
                }}
              >
                <PortfolioHeroStageCard
                  cardId="preview"
                  constellationMode={constellationMode}
                  cvDownload={cvDownload}
                  profile={profile}
                  showEntranceAnimation
                  variant="hero"
                />
              </motion.div>
            </div>

            <div
              className="absolute inset-0 [perspective:1700px]"
              style={{
                transform: "translateY(clamp(-18rem, -20svh, -10.4rem))",
              }}
            >
              <motion.div
                className="absolute left-[calc(50%-5.25rem)] top-[54.9%] h-[27.7rem] w-[31.2rem] -translate-x-1/2 -translate-y-1/2"
                style={{
                  opacity: monitorOpacity,
                  x: monitorX,
                  y: monitorY,
                  scale: monitorScale,
                  zIndex: 10,
                }}
              >
                <motion.div
                  className="absolute left-1/2 top-[73.6%] h-[1.8rem] w-[22rem] -translate-x-1/2 rounded-full bg-[rgba(15,23,42,0.11)] blur-[18px]"
                  style={{
                    opacity: monitorShadowOpacity,
                    scaleX: monitorShadowScale,
                  }}
                />

                <div
                  className="absolute overflow-hidden rounded-[1.85rem] bg-[linear-gradient(180deg,rgba(251,248,242,0.98),rgba(243,239,232,0.96))] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.05)]"
                  style={{ top: "3.5%", left: "2.9%", right: "3%", bottom: "29.7%" }}
                >
                  <motion.div
                    ref={screenTargetRef}
                    className="absolute left-1/2 top-1/2 w-[81rem] -translate-x-1/2 -translate-y-1/2"
                    style={{
                      opacity: screenCardOpacity,
                      scale: screenCardScale,
                    }}
                  >
                    <PortfolioHeroStageCard
                      cardId="screen"
                      cvDownload={cvDownload}
                      decorative
                      profile={profile}
                      variant="hero"
                    />
                  </motion.div>

                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_18%,transparent_82%,rgba(15,23,42,0.05)),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.07),transparent_28%)]"
                    style={{ opacity: screenViewportOverlayOpacity }}
                  />
                </div>

                <Image
                  src={monitorFrameAsset}
                  alt=""
                  fill
                  sizes="624px"
                  className="pointer-events-none object-contain select-none"
                  priority
                />
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-[72.8%] h-[9.5rem] w-[86rem] -translate-x-1/2"
                style={{
                  opacity: deskOpacity,
                  scaleX: deskScale,
                  y: deskY,
                  zIndex: 2,
                }}
              >
                <div className="absolute left-1/2 top-[0.6rem] h-[3.4rem] w-[72rem] -translate-x-1/2 rounded-full bg-[rgba(188,144,90,0.12)] blur-[18px]" />
                <div className="absolute inset-0">
                  <Image
                    src={deskAsset}
                    alt=""
                    fill
                    sizes="1312px"
                    className="pointer-events-none object-contain saturate-[1.12] contrast-[1.04] drop-shadow-[0_18px_28px_rgba(105,78,42,0.08)] select-none"
                  />
                </div>
                <div className="absolute left-[49%] top-[2.78rem] z-10 h-[3.5rem] w-[29.6rem] -translate-x-1/2">
                  <Image
                    src={keyboardAsset}
                    alt=""
                    fill
                    sizes="474px"
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
                <div className="absolute left-[63.8%] top-[3.18rem] z-10 h-[2.15rem] w-[5.15rem]">
                  <Image
                    src={mouseAsset}
                    alt=""
                    fill
                    sizes="82px"
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-[-4%] right-[-0.5rem] h-[26.8rem] w-[21.9rem]"
                style={{
                  opacity: figureOpacity,
                  scale: 1.12,
                  transformOrigin: "right bottom",
                  x: figureX,
                  y: figureY,
                  zIndex: 12,
                }}
              >
                <SeatedCharacterFigure animateHands />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </section>
    </>
  );
}

"use client";

import type { PointerEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type PageBackdropTrackerProps = {
  children: ReactNode;
  className?: string;
};

type PointState = {
  x: number;
  y: number;
  active: number;
};

const GRID_SPACING = 84;
const SAMPLE_STEP = 16;
const WARP_RADIUS = 288;
const WARP_WAVE = 36;
const WARP_BULGE = 18;
const WARP_RING_COUNT = 0.15;
const FOLLOW_EASE = 0.16;
const FADE_EASE = 0.14;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const clamped = clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function buildGridPaths(
  width: number,
  height: number,
  point?: PointState
) {
  const offsetX = (width % GRID_SPACING) / 2;
  const offsetY = (height % GRID_SPACING) / 2;
  const horizontalSegments: string[] = [];
  const verticalSegments: string[] = [];

  const distortPoint = (x: number, y: number) => {
    if (!point || point.active <= 0.001) {
      return { x, y };
    }

    const dx = x - point.x;
    const dy = y - point.y;
    const distance = Math.hypot(dx, dy);

    if (distance >= WARP_RADIUS) {
      return { x, y };
    }

    const influence = smoothstep(1 - distance / WARP_RADIUS) * point.active;
    const directionX = distance > 0.001 ? dx / distance : 0;
    const directionY = distance > 0.001 ? dy / distance : 0;
    const ripple =
      Math.cos((distance / WARP_RADIUS) * Math.PI * WARP_RING_COUNT) *
      WARP_WAVE *
      influence;
    const push = WARP_BULGE * influence + ripple;

    return {
      x: x + directionX * push,
      y: y + directionY * push,
    };
  };

  for (let y = offsetY; y <= height + 0.5; y += GRID_SPACING) {
    const points: string[] = [];

    for (let x = 0; x <= width + SAMPLE_STEP; x += SAMPLE_STEP) {
      const next = distortPoint(Math.min(x, width), y);
      points.push(`${next.x.toFixed(1)} ${next.y.toFixed(1)}`);
    }

    if (points.length > 0) {
      horizontalSegments.push(`M ${points[0]} L ${points.slice(1).join(" L ")}`);
    }
  }

  for (let x = offsetX; x <= width + 0.5; x += GRID_SPACING) {
    const points: string[] = [];

    for (let y = 0; y <= height + SAMPLE_STEP; y += SAMPLE_STEP) {
      const next = distortPoint(x, Math.min(y, height));
      points.push(`${next.x.toFixed(1)} ${next.y.toFixed(1)}`);
    }

    if (points.length > 0) {
      verticalSegments.push(`M ${points[0]} L ${points.slice(1).join(" L ")}`);
    }
  }

  return {
    horizontal: horizontalSegments.join(" "),
    vertical: verticalSegments.join(" "),
  };
}

export function PageBackdropTracker({
  children,
  className,
}: PageBackdropTrackerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const baseHorizontalRef = useRef<SVGPathElement>(null);
  const baseVerticalRef = useRef<SVGPathElement>(null);
  const warpHorizontalRef = useRef<SVGPathElement>(null);
  const warpVerticalRef = useRef<SVGPathElement>(null);
  const warpGroupRef = useRef<SVGGElement>(null);
  const maskGradientRef = useRef<SVGRadialGradientElement>(null);
  const baseMaskGradientRef = useRef<SVGRadialGradientElement>(null);
  const baseMaskOverlayRef = useRef<SVGRectElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPointRef = useRef<PointState>({ x: 0, y: 0, active: 0 });
  const currentPointRef = useRef<PointState>({ x: 0, y: 0, active: 0 });
  const reduceMotionRef = useRef(false);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const ids = useId().replace(/:/g, "");
  const maskId = `${ids}-grid-mask`;
  const gradientId = `${ids}-grid-gradient`;
  const baseMaskId = `${ids}-grid-base-mask`;
  const baseGradientId = `${ids}-grid-base-gradient`;

  const drawBaseGrid = (width: number, height: number) => {
    const paths = buildGridPaths(width, height);

    baseHorizontalRef.current?.setAttribute("d", paths.horizontal);
    baseVerticalRef.current?.setAttribute("d", paths.vertical);
  };

  const drawWarpGrid = (width: number, height: number, point: PointState) => {
    const paths = buildGridPaths(width, height, point);

    warpHorizontalRef.current?.setAttribute("d", paths.horizontal);
    warpVerticalRef.current?.setAttribute("d", paths.vertical);
    warpGroupRef.current?.setAttribute("opacity", point.active.toFixed(3));
    maskGradientRef.current?.setAttribute("cx", point.x.toFixed(1));
    maskGradientRef.current?.setAttribute("cy", point.y.toFixed(1));
    maskGradientRef.current?.setAttribute("r", "320");
    baseMaskGradientRef.current?.setAttribute("cx", point.x.toFixed(1));
    baseMaskGradientRef.current?.setAttribute("cy", point.y.toFixed(1));
    baseMaskGradientRef.current?.setAttribute("r", "320");
    baseMaskOverlayRef.current?.setAttribute("opacity", point.active.toFixed(3));
  };

  const tick = () => {
    const target = targetPointRef.current;
    const current = currentPointRef.current;

    current.x += (target.x - current.x) * FOLLOW_EASE;
    current.y += (target.y - current.y) * FOLLOW_EASE;
    current.active += (target.active - current.active) * FADE_EASE;

    drawWarpGrid(viewport.width, viewport.height, current);

    const settled =
      Math.abs(target.x - current.x) < 0.25 &&
      Math.abs(target.y - current.y) < 0.25 &&
      Math.abs(target.active - current.active) < 0.01;

    if (settled) {
      current.x = target.x;
      current.y = target.y;
      current.active = target.active;
      drawWarpGrid(viewport.width, viewport.height, current);
      rafRef.current = null;
      return;
    }

    rafRef.current = window.requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (reduceMotionRef.current || rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      reduceMotionRef.current = mediaQuery.matches;
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.max(1, Math.round(entry.contentRect.width));
      const nextHeight = Math.max(1, Math.round(entry.contentRect.height));

      setViewport((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight }
      );
    });

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    drawBaseGrid(viewport.width, viewport.height);
    drawWarpGrid(viewport.width, viewport.height, currentPointRef.current);
  }, [viewport]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const updatePointer = (clientX: number, clientY: number, active: number) => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);

    if (currentPointRef.current.active < 0.02 && active > 0) {
      currentPointRef.current.x = x;
      currentPointRef.current.y = y;
    }

    targetPointRef.current = { x, y, active };
    startLoop();
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY, 1);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY, 1);
  };

  const handlePointerLeave = () => {
    targetPointRef.current = {
      ...targetPointRef.current,
      active: 0,
    };
    startLoop();
  };

  return (
    <div
      ref={frameRef}
      className={cn("relative", className)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden"
      >
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${viewport.width} ${viewport.height}`}
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <radialGradient
              id={gradientId}
              ref={maskGradientRef}
              gradientUnits="userSpaceOnUse"
              cx={viewport.width / 2}
              cy={viewport.height / 3}
              r="320"
            >
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="1" />
              <stop offset="82%" stopColor="white" stopOpacity="0.22" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </radialGradient>

            <mask id={maskId}>
              <rect
                width={viewport.width}
                height={viewport.height}
                fill={`url(#${gradientId})`}
              />
            </mask>

            <radialGradient
              id={baseGradientId}
              ref={baseMaskGradientRef}
              gradientUnits="userSpaceOnUse"
              cx={viewport.width / 2}
              cy={viewport.height / 3}
              r="320"
            >
              <stop offset="0%" stopColor="black" />
              <stop offset="58%" stopColor="black" />
              <stop offset="82%" stopColor="white" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>

            <mask id={baseMaskId}>
              <rect width={viewport.width} height={viewport.height} fill="white" />
              <rect
                ref={baseMaskOverlayRef}
                width={viewport.width}
                height={viewport.height}
                fill={`url(#${baseGradientId})`}
                opacity="0"
              />
            </mask>
          </defs>

          <g
            fill="none"
            stroke="rgba(23,35,53,0.06)"
            strokeWidth="1"
            mask={`url(#${baseMaskId})`}
            vectorEffect="non-scaling-stroke"
          >
            <path ref={baseHorizontalRef} />
            <path ref={baseVerticalRef} />
          </g>

          <g
            ref={warpGroupRef}
            fill="none"
            stroke="rgba(23,35,53,0.12)"
            strokeWidth="1.2"
            mask={`url(#${maskId})`}
            opacity="0"
            vectorEffect="non-scaling-stroke"
          >
            <path ref={warpHorizontalRef} />
            <path ref={warpVerticalRef} />
          </g>
        </svg>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type HeroExperienceOrbitProps = {
  mode?: HeroExperienceOrbitMode;
  showEntranceAnimation?: boolean;
};

export type HeroExperienceOrbitMode = "auto" | "idle" | "transition";

type OrbitNode = {
  id: string;
  x: number;
  y: number;
  delay: number;
  tone: "ink" | "soft" | "warm";
  anchor?: "bottom" | "left" | "right" | "top";
  label?: string;
  size?: "tiny" | "small" | "medium";
};

const starClipPath =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

const hitMotionVectors = [
  { x: "0px", y: "-3px" },
  { x: "3px", y: "-2px" },
  { x: "3px", y: "0px" },
  { x: "2px", y: "3px" },
  { x: "0px", y: "3px" },
  { x: "-3px", y: "2px" },
  { x: "-3px", y: "0px" },
  { x: "-2px", y: "-3px" },
] as const;

type HitMotion = (typeof hitMotionVectors)[number];

const constellationNodes: OrbitNode[] = [
  {
    id: "operations",
    label: "Operations",
    x: -1,
    y: 27,
    anchor: "left",
    delay: 780,
    tone: "warm",
    size: "medium",
  },
  {
    id: "left-dust-a",
    x: -7,
    y: 19,
    delay: 810,
    tone: "soft",
    size: "tiny",
  },
  {
    id: "operations-knot",
    x: 4,
    y: 43,
    delay: 840,
    tone: "warm",
  },
  {
    id: "left-dust-b",
    x: -5,
    y: 48,
    delay: 870,
    tone: "ink",
    size: "tiny",
  },
  {
    id: "systems-core",
    label: "Systems",
    x: 0,
    y: 63,
    anchor: "left",
    delay: 900,
    tone: "soft",
    size: "medium",
  },
  {
    id: "left-dust-c",
    x: -6,
    y: 75,
    delay: 930,
    tone: "warm",
    size: "tiny",
  },
  {
    id: "systems-bridge",
    x: 5,
    y: 78,
    delay: 960,
    tone: "soft",
  },
  {
    id: "automation",
    label: "Automation",
    x: 15,
    y: 97,
    anchor: "bottom",
    delay: 1020,
    tone: "ink",
    size: "medium",
  },
  {
    id: "bottom-left-dust",
    x: 4,
    y: 106,
    delay: 1080,
    tone: "soft",
    size: "tiny",
  },
  {
    id: "uoa",
    label: "Learning",
    x: 13,
    y: 8,
    anchor: "top",
    delay: 940,
    tone: "ink",
    size: "medium",
  },
  {
    id: "top-left-dust",
    x: 3,
    y: -2,
    delay: 970,
    tone: "soft",
    size: "tiny",
  },
  {
    id: "education-knot",
    x: 24,
    y: 16,
    delay: 1000,
    tone: "soft",
  },
  {
    id: "top-dust-a",
    x: 26,
    y: -7,
    delay: 1030,
    tone: "warm",
    size: "tiny",
  },
  {
    id: "mit",
    label: "Training",
    x: 35,
    y: 1,
    anchor: "top",
    delay: 1060,
    tone: "soft",
    size: "medium",
  },
  {
    id: "top-dust-b",
    x: 42,
    y: -5,
    delay: 1090,
    tone: "ink",
    size: "tiny",
  },
  {
    id: "engineering-knot",
    x: 47,
    y: 13,
    delay: 1120,
    tone: "ink",
  },
  {
    id: "full-stack",
    label: "Full-stack",
    x: 59,
    y: 7,
    anchor: "top",
    delay: 1180,
    tone: "ink",
    size: "medium",
  },
  {
    id: "top-dust-c",
    x: 68,
    y: -6,
    delay: 1210,
    tone: "soft",
    size: "tiny",
  },
  {
    id: "workflow",
    label: "Workflow",
    x: 78,
    y: 2,
    anchor: "top",
    delay: 1240,
    tone: "warm",
    size: "medium",
  },
  {
    id: "top-right-dust",
    x: 91,
    y: -1,
    delay: 1270,
    tone: "warm",
    size: "tiny",
  },
  {
    id: "ai-knot",
    x: 88,
    y: 17,
    delay: 1300,
    tone: "warm",
  },
  {
    id: "project",
    label: "Project",
    x: 99,
    y: 31,
    anchor: "right",
    delay: 1360,
    tone: "ink",
    size: "medium",
  },
  {
    id: "right-dust-a",
    x: 110,
    y: 22,
    delay: 1390,
    tone: "soft",
    size: "tiny",
  },
  {
    id: "dvf",
    label: "Scoring",
    x: 99,
    y: 55,
    anchor: "right",
    delay: 1420,
    tone: "warm",
    size: "medium",
  },
  {
    id: "right-dust-b",
    x: 107,
    y: 67,
    delay: 1450,
    tone: "warm",
    size: "tiny",
  },
  {
    id: "product",
    label: "Product Systems",
    x: 96,
    y: 80,
    anchor: "right",
    delay: 1480,
    tone: "soft",
    size: "medium",
  },
  {
    id: "right-dust-c",
    x: 101,
    y: 93,
    delay: 1510,
    tone: "ink",
    size: "tiny",
  },
  {
    id: "product-knot",
    x: 86,
    y: 92,
    delay: 1540,
    tone: "soft",
  },
  {
    id: "systems",
    label: "Systems Delivery",
    x: 69,
    y: 103,
    anchor: "bottom",
    delay: 1600,
    tone: "soft",
    size: "medium",
  },
  {
    id: "bottom-dust-a",
    x: 59,
    y: 112,
    delay: 1630,
    tone: "soft",
    size: "tiny",
  },
  {
    id: "analytics",
    label: "Analytics",
    x: 44,
    y: 104,
    anchor: "bottom",
    delay: 1660,
    tone: "warm",
    size: "medium",
  },
  {
    id: "bottom-dust-b",
    x: 37,
    y: 113,
    delay: 1690,
    tone: "warm",
    size: "tiny",
  },
  {
    id: "data-knot",
    x: 31,
    y: 94,
    delay: 1720,
    tone: "warm",
  },
  {
    id: "bottom-dust-c",
    x: 83,
    y: 111,
    delay: 1750,
    tone: "ink",
    size: "tiny",
  },
];

const constellationSegments = [
  ["left-dust-a", "operations", "operations-knot", "left-dust-b"],
  ["left-dust-b", "systems-core", "systems-bridge", "left-dust-c"],
  ["bottom-left-dust", "automation", "data-knot", "analytics"],
  ["top-left-dust", "uoa", "education-knot", "top-dust-a"],
  ["top-dust-a", "mit", "engineering-knot", "top-dust-b"],
  ["engineering-knot", "full-stack", "top-dust-c", "workflow"],
  ["top-right-dust", "workflow", "ai-knot", "right-dust-a"],
  ["ai-knot", "project", "right-dust-a"],
  ["dvf", "right-dust-b", "product"],
  ["product", "right-dust-c", "product-knot"],
  ["bottom-dust-b", "analytics", "bottom-dust-a"],
  ["bottom-dust-a", "systems", "bottom-dust-c"],
];

const scanNodeIds = [
  "top-left-dust",
  "uoa",
  "right-dust-b",
  "operations-knot",
  "top-dust-a",
  "systems",
  "education-knot",
  "right-dust-a",
  "analytics",
  "workflow",
  "left-dust-b",
  "product-knot",
  "mit",
  "bottom-left-dust",
  "project",
  "systems-bridge",
  "top-dust-c",
  "systems-core",
  "bottom-dust-a",
  "ai-knot",
  "automation",
  "top-dust-b",
  "product",
  "left-dust-c",
  "engineering-knot",
  "dvf",
  "data-knot",
  "full-stack",
  "right-dust-c",
  "operations",
  "bottom-dust-b",
  "top-right-dust",
  "left-dust-a",
  "bottom-dust-c",
  "uoa",
];

const nodeById = Object.fromEntries(
  constellationNodes.map((node) => [node.id, node])
) as Record<string, OrbitNode>;

const toneStyles = {
  ink: {
    background: "rgba(23, 51, 87, 0.72)",
    glow: "rgba(23, 51, 87, 0.16)",
    label: "rgba(23, 35, 53, 0.78)",
  },
  soft: {
    background: "rgba(66, 82, 102, 0.54)",
    glow: "rgba(66, 82, 102, 0.12)",
    label: "rgba(50, 66, 85, 0.7)",
  },
  warm: {
    background: "rgba(156, 119, 72, 0.52)",
    glow: "rgba(156, 119, 72, 0.14)",
    label: "rgba(84, 66, 42, 0.74)",
  },
} satisfies Record<
  OrbitNode["tone"],
  {
    background: string;
    glow: string;
    label: string;
  }
>;

function getEnterStyle(enabled: boolean, delayMs: number) {
  if (!enabled) {
    return undefined;
  }

  return {
    "--folio-enter-delay": `${delayMs}ms`,
    "--folio-enter-distance": "5px",
    "--folio-enter-blur": "2px",
  } as CSSProperties;
}

function getLineStyle(enabled: boolean, delayMs: number) {
  if (!enabled) {
    return undefined;
  }

  return {
    "--folio-constellation-delay": `${delayMs}ms`,
  } as CSSProperties;
}

function getStarStyle(
  tone: (typeof toneStyles)[OrbitNode["tone"]],
  motion: HitMotion,
  delayMs: number,
  hitDelayMs: number
) {
  return {
    "--folio-star-delay": `${delayMs + 1700}ms`,
    "--folio-hit-delay": `${hitDelayMs}ms`,
    "--folio-hit-x": motion.x,
    "--folio-hit-y": motion.y,
    backgroundColor: tone.background,
    clipPath: starClipPath,
    filter: `drop-shadow(0 0 8px ${tone.glow})`,
  } as CSSProperties;
}

function getSegmentPoints(ids: string[]) {
  return ids
    .map((id) => {
      const node = nodeById[id];
      return `${node.x},${node.y}`;
    })
    .join(" ");
}

function getPathData(ids: string[]) {
  return ids
    .map((id, index) => {
      const node = nodeById[id];
      const command = index === 0 ? "M" : "L";

      return `${command} ${node.x} ${node.y}`;
    })
    .join(" ");
}

function getHitMotion(id: string) {
  const motionIndex = Array.from(id).reduce(
    (total, letter) => total + letter.charCodeAt(0),
    0
  );

  return hitMotionVectors[motionIndex % hitMotionVectors.length];
}

function getLabelPositionClass(anchor: NonNullable<OrbitNode["anchor"]>) {
  switch (anchor) {
    case "bottom":
      return "left-1/2 top-[calc(100%+0.76rem)] -translate-x-1/2";
    case "left":
      return "right-[calc(100%+0.84rem)] top-1/2 -translate-y-1/2";
    case "right":
      return "left-[calc(100%+0.84rem)] top-1/2 -translate-y-1/2";
    case "top":
      return "bottom-[calc(100%+0.76rem)] left-1/2 -translate-x-1/2";
  }
}

function getLabelOrigin(anchor: NonNullable<OrbitNode["anchor"]>) {
  switch (anchor) {
    case "bottom":
      return "center top";
    case "left":
      return "right center";
    case "right":
      return "left center";
    case "top":
      return "center bottom";
  }
}

function getCycleDuration(mode: HeroExperienceOrbitMode) {
  if (mode === "transition") {
    return 24000;
  }

  return 36000;
}

function getHitDelay(id: string, cycleDuration: number) {
  const index = scanNodeIds.indexOf(id);

  if (index < 0) {
    return 0;
  }

  return (cycleDuration / (scanNodeIds.length - 1)) * index;
}

export function HeroExperienceOrbit({
  mode = "auto",
  showEntranceAnimation = false,
}: HeroExperienceOrbitProps) {
  const cycleDuration = getCycleDuration(mode);
  const scanPath = getPathData(scanNodeIds);

  return (
    <div
      aria-hidden="true"
      data-constellation-mode={mode}
      className="folio-constellation-field pointer-events-none absolute bottom-[-5.4rem] left-[-7rem] right-[-2.75rem] top-[-5.4rem] z-0 hidden overflow-visible xl:block 2xl:bottom-[-6.6rem] 2xl:left-[-9rem] 2xl:right-[-4rem] 2xl:top-[-6.6rem]"
      style={{
        "--folio-constellation-cycle": `${cycleDuration}ms`,
      } as CSSProperties}
    >
      <svg
        className="absolute inset-0 z-0 h-full w-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {constellationSegments.map((segment, index) => (
          <polyline
            key={segment.join("-")}
            className="folio-constellation-line"
            pathLength={1}
            points={getSegmentPoints(segment)}
            stroke={
              index === 0 || index === 1 || index === 8
                ? "rgba(156, 119, 72, 0.16)"
                : "rgba(23, 51, 87, 0.18)"
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={index > 3 ? "0.14" : "0.2"}
            style={getLineStyle(showEntranceAnimation, 680 + index * 150)}
          />
        ))}

        <path
          className="folio-constellation-scan-path"
          d={scanPath}
          pathLength={1}
        />

        <circle
          key={`constellation-scan-${mode}`}
          className="folio-constellation-scan-dot"
          r={mode === "transition" ? "0.82" : "0.68"}
        >
          <animateMotion
            dur={`${cycleDuration}ms`}
            path={scanPath}
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>
      </svg>

      {constellationNodes.map((node) => {
        const tone = toneStyles[node.tone];
        const hitDelay = getHitDelay(node.id, cycleDuration);
        const motion = getHitMotion(node.id);

        return (
          <div
            key={node.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >
            <div
              className={cn(
                showEntranceAnimation && "folio-hero-enter",
                "relative"
              )}
              style={getEnterStyle(showEntranceAnimation, node.delay)}
            >
              <span
                className={cn(
                  "folio-constellation-star relative block",
                  node.label
                    ? "folio-constellation-star--label"
                    : "folio-constellation-star--ambient",
                  node.size === "medium"
                    ? "h-3 w-3"
                    : node.size === "tiny"
                      ? "h-1.5 w-1.5"
                      : "h-2 w-2"
                )}
                style={getStarStyle(tone, motion, node.delay, hitDelay)}
              />

              {node.label && node.anchor ? (
                <span
                  className={cn(
                    "folio-constellation-label absolute whitespace-nowrap text-sm font-semibold leading-none tracking-normal [filter:drop-shadow(0_10px_18px_rgba(23,35,53,0.13))] [text-shadow:0_1px_0_rgba(255,255,255,0.98),0_3px_12px_rgba(255,255,255,0.94),0_10px_24px_rgba(23,35,53,0.2)]",
                    getLabelPositionClass(node.anchor)
                  )}
                  style={{
                    "--folio-hit-delay": `${hitDelay}ms`,
                    "--folio-hit-x": motion.x,
                    "--folio-hit-y": motion.y,
                    "--folio-label-origin": getLabelOrigin(node.anchor),
                    color: tone.label,
                  } as CSSProperties}
                >
                  {node.label}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

type PointerPosition = {
  x: number;
  y: number;
};

type CharacterMotion = {
  faceX: number;
  faceY: number;
  shiftX: number;
  shiftY: number;
  tilt: number;
};

type EyeBallProps = {
  pointer: PointerPosition;
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
};

const INITIAL_POINTER: PointerPosition = {
  x: 960,
  y: 540,
};

const INITIAL_MOTION: CharacterMotion = {
  faceX: 0,
  faceY: 0,
  shiftX: 0,
  shiftY: 0,
  tilt: 0,
};

function subscribeToHydration() {
  return () => undefined;
}

function useHasHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useWindowPointer(disabled: boolean): PointerPosition {
  const [pointer, setPointer] = useState<PointerPosition>(INITIAL_POINTER);
  const pointerRef = useRef(pointer);
  const pendingPointerRef = useRef<PointerPosition | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (disabled) {
      return undefined;
    }

    const commitPointer = () => {
      frameRef.current = null;
      const nextPointer = pendingPointerRef.current;
      pendingPointerRef.current = null;

      if (!nextPointer) {
        return;
      }

      if (
        pointerRef.current.x === nextPointer.x &&
        pointerRef.current.y === nextPointer.y
      ) {
        return;
      }

      pointerRef.current = nextPointer;
      startTransition(() => {
        setPointer(nextPointer);
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      pendingPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(commitPointer);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      pendingPointerRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [disabled]);

  return pointer;
}

function useBlinking(
  enabled: boolean,
  {
    minDelay = 2600,
    maxDelay = 4800,
    duration = 150,
  }: {
    minDelay?: number;
    maxDelay?: number;
    duration?: number;
  } = {}
) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let blinkTimer: ReturnType<typeof setTimeout> | null = null;
    let reopenTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const scheduleBlink = () => {
      if (disposed) {
        return;
      }

      const nextDelay = minDelay + Math.random() * (maxDelay - minDelay);
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        reopenTimer = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, duration);
      }, nextDelay);
    };

    scheduleBlink();

    return () => {
      disposed = true;
      if (blinkTimer) {
        clearTimeout(blinkTimer);
      }
      if (reopenTimer) {
        clearTimeout(reopenTimer);
      }
    };
  }, [duration, enabled, maxDelay, minDelay]);

  return enabled ? isBlinking : false;
}

function resolvePupilPosition({
  container,
  pointer,
  maxDistance,
}: {
  container: HTMLDivElement | null;
  pointer: PointerPosition;
  maxDistance: number;
}) {
  if (!container) {
    return { x: 0, y: 0 };
  }

  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = pointer.x - centerX;
  const deltaY = pointer.y - centerY;
  const angle = Math.atan2(deltaY, deltaX);
  const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function computeCharacterMotion(
  node: HTMLDivElement | null,
  pointer: PointerPosition
): CharacterMotion {
  if (!node) {
    return INITIAL_MOTION;
  }

  const rect = node.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 3;
  const deltaX = pointer.x - centerX;
  const deltaY = pointer.y - centerY;

  return {
    faceX: clamp(deltaX / 24, -10, 10),
    faceY: clamp(deltaY / 38, -7, 7),
    shiftX: clamp(deltaX / 52, -8, 8),
    shiftY: clamp(deltaY / 90, -4, 6),
    tilt: clamp(-deltaX / 150, -4, 4),
  };
}

function computeAmbientDrift(
  pointer: PointerPosition,
  {
    intensityX,
    intensityY,
    invertX = false,
    invertY = false,
  }: {
    intensityX: number;
    intensityY: number;
    invertX?: boolean;
    invertY?: boolean;
  }
) {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  const ratioX = clamp(pointer.x / window.innerWidth - 0.5, -0.5, 0.5);
  const ratioY = clamp(pointer.y / window.innerHeight - 0.5, -0.5, 0.5);

  return {
    x: ratioX * intensityX * (invertX ? -1 : 1),
    y: ratioY * intensityY * (invertY ? -1 : 1),
  };
}

function EyeBall({
  pointer,
  size = 18,
  pupilSize = 7,
  maxDistance = 4,
  eyeColor = "#ffffff",
  pupilColor = "#0f172a",
  isBlinking = false,
}: EyeBallProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPosition(
        resolvePupilPosition({
          container: eyeRef.current,
          pointer,
          maxDistance,
        })
      );
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [maxDistance, pointer]);

  return (
    <div
      ref={eyeRef}
      className="flex items-center justify-center rounded-full transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking ? (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: "transform 120ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}

export function PortfolioCharacterScene({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const hasHydrated = useHasHydrated();
  const interactiveMotionEnabled = hasHydrated && !reduceMotion;
  const pointer = useWindowPointer(!interactiveMotionEnabled);
  const blueBlinking = useBlinking(interactiveMotionEnabled);
  const slateBlinking = useBlinking(interactiveMotionEnabled, {
    minDelay: 3200,
    maxDelay: 5600,
  });
  const sandBlinking = useBlinking(interactiveMotionEnabled, {
    minDelay: 3600,
    maxDelay: 6200,
    duration: 170,
  });
  const blueRef = useRef<HTMLDivElement>(null);
  const slateRef = useRef<HTMLDivElement>(null);
  const mintRef = useRef<HTMLDivElement>(null);
  const sandRef = useRef<HTMLDivElement>(null);
  const [motions, setMotions] = useState(() => ({
    blue: INITIAL_MOTION,
    slate: INITIAL_MOTION,
    mint: INITIAL_MOTION,
    sand: INITIAL_MOTION,
  }));

  useEffect(() => {
    if (!interactiveMotionEnabled) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      setMotions({
        blue: computeCharacterMotion(blueRef.current, pointer),
        slate: computeCharacterMotion(slateRef.current, pointer),
        mint: computeCharacterMotion(mintRef.current, pointer),
        sand: computeCharacterMotion(sandRef.current, pointer),
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [interactiveMotionEnabled, pointer]);

  const visibleMotions = !interactiveMotionEnabled
    ? {
        blue: INITIAL_MOTION,
        slate: INITIAL_MOTION,
        mint: INITIAL_MOTION,
        sand: INITIAL_MOTION,
      }
    : motions;
  const greenDotDrift = !interactiveMotionEnabled
    ? { x: 0, y: 0 }
    : computeAmbientDrift(pointer, {
        intensityX: 14,
        intensityY: 12,
      });
  const grayDotDrift = !interactiveMotionEnabled
    ? { x: 0, y: 0 }
    : computeAmbientDrift(pointer, {
        intensityX: 9,
        intensityY: 8,
        invertX: true,
        invertY: true,
      });

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative isolate h-full min-h-[220px] overflow-visible bg-transparent",
        className
      )}
    >
      <motion.div
        className="absolute -right-10 top-2 h-36 w-36 rounded-full bg-[rgba(23,51,87,0.08)] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1],
                x: [0, -10, 0],
                y: [0, 8, 0],
                opacity: [0.22, 0.3, 0.22],
              }
        }
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute -left-10 bottom-2 h-40 w-40 rounded-full bg-[rgba(19,140,124,0.1)] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.1, 1],
                x: [0, 8, 0],
                y: [0, -12, 0],
                opacity: [0.18, 0.28, 0.18],
              }
        }
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
      />

      <div
        className="absolute left-6 top-8"
        style={{
          transform: `translate3d(${greenDotDrift.x}px, ${greenDotDrift.y}px, 0)`,
        }}
      >
        <motion.div
          className="relative h-4 w-4 rounded-full bg-[rgba(19,140,124,0.52)]"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 5, -4, 2, 0],
                  y: [0, -8, 3, -2, 0],
                  scale: [1, 1.1, 0.95, 1.04, 1],
                  opacity: [0.44, 0.72, 0.36, 0.6, 0.44],
                }
          }
          transition={{ duration: 8.2, ease: "easeInOut", repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-[-8px] rounded-full bg-[rgba(19,140,124,0.08)] blur-md"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.25, 0.96, 1],
                    opacity: [0.3, 0.5, 0.2, 0.3],
                  }
            }
            transition={{ duration: 6.8, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>
      </div>
      <div
        className="absolute right-12 top-14"
        style={{
          transform: `translate3d(${grayDotDrift.x}px, ${grayDotDrift.y}px, 0)`,
        }}
      >
        <motion.div
          className="relative h-2.5 w-2.5 rounded-full bg-[rgba(125,135,151,0.42)]"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -4, 3, 0],
                  y: [0, 5, -3, 0],
                  scale: [1, 0.94, 1.08, 1],
                  opacity: [0.24, 0.46, 0.28, 0.24],
                }
          }
          transition={{
            duration: 6.9,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.9,
          }}
        >
          <motion.div
            className="absolute inset-[-6px] rounded-full bg-[rgba(125,135,151,0.06)] blur-sm"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.22, 0.98, 1],
                    opacity: [0.24, 0.42, 0.16, 0.24],
                  }
            }
            transition={{
              duration: 6.1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.4,
            }}
          />
        </motion.div>
      </div>

      <div className="relative h-full px-3 pb-4">
        <motion.div
          className="absolute bottom-3 left-4"
          animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 5.6, ease: "easeInOut", repeat: Infinity }}
        >
          <div
            ref={blueRef}
            className="relative h-[142px] w-[108px] rounded-[2.8rem_2.8rem_1.6rem_1.6rem] border border-white/20 bg-[linear-gradient(180deg,#173357,#234a77_72%,#1d3559)] shadow-[0_18px_30px_rgba(23,35,53,0.18)]"
            style={{
              transform: `translate(${visibleMotions.blue.shiftX}px, ${visibleMotions.blue.shiftY}px) skewX(${visibleMotions.blue.tilt}deg)`,
            }}
          >
            <div
              className="absolute flex gap-3"
              style={{
                left: `${24 + visibleMotions.blue.faceX}px`,
                top: `${30 + visibleMotions.blue.faceY}px`,
              }}
            >
              <EyeBall
                pointer={pointer}
                size={20}
                pupilSize={7}
                maxDistance={4}
                isBlinking={blueBlinking}
              />
              <EyeBall
                pointer={pointer}
                size={20}
                pupilSize={7}
                maxDistance={4}
                isBlinking={blueBlinking}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-[25%] top-[10%]"
          animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, -1.2, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: 0.4 }}
        >
          <div
            ref={slateRef}
            className="relative h-[86px] w-[104px] rounded-[999px] border border-white/24 bg-[linear-gradient(180deg,#7d8797,#57677d)] shadow-[0_14px_28px_rgba(23,35,53,0.15)]"
            style={{
              transform: `translate(${visibleMotions.slate.shiftX}px, ${visibleMotions.slate.shiftY}px) skewX(${visibleMotions.slate.tilt}deg)`,
            }}
          >
            <div
              className="absolute flex gap-3"
              style={{
                left: `${22 + visibleMotions.slate.faceX}px`,
                top: `${24 + visibleMotions.slate.faceY}px`,
              }}
            >
              <EyeBall
                pointer={pointer}
                size={16}
                pupilSize={6}
                maxDistance={3}
                isBlinking={slateBlinking}
              />
              <EyeBall
                pointer={pointer}
                size={16}
                pupilSize={6}
                maxDistance={3}
                isBlinking={slateBlinking}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-9 left-[45%] z-10"
          animate={reduceMotion ? undefined : { y: [0, -11, 0], rotate: [0, 1.2, 0] }}
          transition={{ duration: 6.2, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        >
          <div
            ref={mintRef}
            className="relative h-[126px] w-[88px] rounded-[2.6rem] border border-white/28 bg-[linear-gradient(180deg,#d9f0ea,#98cec3)] shadow-[0_12px_20px_rgba(19,140,124,0.08)]"
            style={{
              transform: `translate(${visibleMotions.mint.shiftX}px, ${visibleMotions.mint.shiftY}px) skewX(${visibleMotions.mint.tilt}deg)`,
            }}
          >
            <div
              className="absolute flex gap-3"
              style={{
                left: `${16 + visibleMotions.mint.faceX}px`,
                top: `${31 + visibleMotions.mint.faceY}px`,
              }}
            >
              <EyeBall
                pointer={pointer}
                size={18}
                pupilSize={6}
                maxDistance={3}
                eyeColor="rgba(255,255,255,0.95)"
                pupilColor="#173357"
              />
              <EyeBall
                pointer={pointer}
                size={18}
                pupilSize={6}
                maxDistance={3}
                eyeColor="rgba(255,255,255,0.95)"
                pupilColor="#173357"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-2 right-0"
          animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, -0.8, 0] }}
          transition={{ duration: 5.8, ease: "easeInOut", repeat: Infinity, delay: 0.7 }}
        >
          <div
            ref={sandRef}
            className="relative h-[110px] w-[138px] rounded-[48%_52%_50%_50%/56%_44%_56%_44%] border border-white/28 bg-[linear-gradient(180deg,#f8efdf,#efddc4)] shadow-[0_14px_22px_rgba(145,111,70,0.08)]"
            style={{
              transform: `translate(${visibleMotions.sand.shiftX}px, ${visibleMotions.sand.shiftY}px) skewX(${visibleMotions.sand.tilt}deg)`,
            }}
          >
            <div
              className="absolute flex gap-4"
              style={{
                left: `${28 + visibleMotions.sand.faceX}px`,
                top: `${28 + visibleMotions.sand.faceY}px`,
              }}
            >
              <EyeBall
                pointer={pointer}
                size={18}
                pupilSize={6}
                maxDistance={4}
                eyeColor="rgba(255,255,255,0.96)"
                pupilColor="#173357"
                isBlinking={sandBlinking}
              />
              <EyeBall
                pointer={pointer}
                size={18}
                pupilSize={6}
                maxDistance={4}
                eyeColor="rgba(255,255,255,0.96)"
                pupilColor="#173357"
                isBlinking={sandBlinking}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

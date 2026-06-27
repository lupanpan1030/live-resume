"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ResumeHeaderGateProps = {
  children: ReactNode;
  className?: string;
  targetId?: string;
};

export function ResumeHeaderGate({
  children,
  className,
  targetId = "resume-header-sentinel",
}: ResumeHeaderGateProps) {
  const [isVisible, setIsVisible] = useState(false);
  const gateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);

    if (!target) {
      return undefined;
    }

    let frameId: number | null = null;

    const getRevealThreshold = () => {
      const headerRect =
        gateRef.current?.firstElementChild?.getBoundingClientRect();

      return Math.min(
        window.innerHeight,
        Math.max(96, (headerRect?.bottom ?? 112) + 16)
      );
    };

    const updateVisibilityFromRect = () => {
      frameId = null;
      const rect = target.getBoundingClientRect();

      setIsVisible(rect.top <= getRevealThreshold());
    };

    const scheduleVisibilityUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateVisibilityFromRect);
    };

    scheduleVisibilityUpdate();
    window.addEventListener("scroll", scheduleVisibilityUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleVisibilityUpdate);
    window.visualViewport?.addEventListener("resize", scheduleVisibilityUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleVisibilityUpdate);
      window.removeEventListener("resize", scheduleVisibilityUpdate);
      window.visualViewport?.removeEventListener(
        "resize",
        scheduleVisibilityUpdate
      );
    };
  }, [targetId]);

  return (
    <div
      ref={gateRef}
      aria-hidden={!isVisible}
      className={cn(
        "transition-opacity duration-300 ease-out",
        isVisible
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

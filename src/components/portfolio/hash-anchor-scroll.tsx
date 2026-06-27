"use client";

import { useEffect } from "react";

type HashAnchorScrollProps = {
  offset?: number;
};

function getHashTarget(hash: string) {
  if (!hash || hash === "#") {
    return null;
  }

  const id = decodeURIComponent(hash.slice(1));

  if (!id) {
    return null;
  }

  return document.getElementById(id);
}

function scrollToHashTarget(hash: string, offset: number) {
  const target = getHashTarget(hash);

  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    behavior: "smooth",
    top: Math.max(0, top),
  });
}

export function HashAnchorScroll({ offset = 96 }: HashAnchorScrollProps) {
  useEffect(() => {
    let frameId: number | null = null;

    const scheduleScroll = (hash = window.location.hash) => {
      if (!hash) {
        return;
      }

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          scrollToHashTarget(hash, offset);
        });
      });
    };

    const handleHashChange = () => {
      scheduleScroll();
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[href]",
      );

      if (!link) {
        return;
      }

      const url = new URL(link.href);

      if (url.pathname !== window.location.pathname || !url.hash) {
        return;
      }

      const target = getHashTarget(url.hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      scrollToHashTarget(url.hash, offset);
    };

    scheduleScroll();
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleAnchorClick, {
        capture: true,
      });
    };
  }, [offset]);

  return null;
}

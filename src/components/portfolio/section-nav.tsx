"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SectionNavItem = {
  href: string;
  label: string;
};

type SectionNavProps = {
  items: SectionNavItem[];
};

export function SectionNav({ items }: SectionNavProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    const updateActiveSection = () => {
      const activationLine = window.innerHeight * 0.24;
      let currentHref = items[0]?.href ?? "";

      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= activationLine) {
          currentHref = items[index]?.href ?? currentHref;
        }
      });

      setActiveHref(currentHref);
      frameRef.current = null;
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [items]);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:block"
    >
      <ul className="relative space-y-1 before:absolute before:bottom-3 before:left-3.5 before:top-3 before:w-px before:bg-[color:var(--folio-line)]">
        {items.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "group grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3 py-2 text-sm font-medium uppercase tracking-[0.12em] text-[color:var(--folio-muted)] transition-colors duration-200 ease-out hover:text-[color:var(--folio-ink)]",
                  isActive && "text-[color:var(--folio-ink)]"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className="flex h-5 items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "block h-1.5 w-1.5 rounded-full bg-[color:var(--folio-line-strong)] transition-all duration-200 ease-out group-hover:bg-[color:var(--folio-accent-2)]",
                      isActive &&
                        "h-2 w-2 bg-[color:var(--folio-accent-2)] ring-4 ring-[color:var(--folio-bg)] shadow-[0_0_0_4px_rgba(19,140,124,0.12)]"
                    )}
                  />
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

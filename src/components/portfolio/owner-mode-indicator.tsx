"use client";

import { Check, Pencil } from "lucide-react";
import { useOwnerEditMode } from "@/components/portfolio/owner-edit-mode";

export function OwnerModeIndicator() {
  const { isEditMode, toggleEditMode } = useOwnerEditMode();

  return (
    <div className="fixed right-4 top-20 z-[60] flex items-center gap-2 rounded-full border border-[color:rgba(19,140,124,0.2)] bg-white/88 px-2 py-2 shadow-[0_14px_34px_rgba(23,35,53,0.12)] backdrop-blur-md sm:right-6 xl:right-10">
      <span className="rounded-full bg-[color:var(--folio-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-accent-2)]">
        Owner
      </span>
      <button
        type="button"
        aria-pressed={isEditMode}
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--folio-ink)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[color:var(--folio-accent-2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--folio-accent-soft)]"
        onClick={toggleEditMode}
      >
        {isEditMode ? (
          <Check className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        <span>{isEditMode ? "Done" : "Edit"}</span>
      </button>
    </div>
  );
}

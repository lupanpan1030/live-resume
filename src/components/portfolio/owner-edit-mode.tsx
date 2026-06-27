"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { Pencil } from "lucide-react";

type OwnerEditModeContextValue = {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
};

type OwnerEditModeProviderProps = {
  children: ReactNode;
};

type OwnerSectionEditButtonProps = {
  isActive?: boolean;
  label: string;
  onClick?: () => void;
};

const OwnerEditModeContext =
  createContext<OwnerEditModeContextValue | null>(null);

export function OwnerEditModeProvider({
  children,
}: OwnerEditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const value = useMemo(
    () => ({
      isEditMode,
      setIsEditMode,
      toggleEditMode: () => setIsEditMode((current) => !current),
    }),
    [isEditMode]
  );

  return (
    <OwnerEditModeContext.Provider value={value}>
      {children}
    </OwnerEditModeContext.Provider>
  );
}

export function useOwnerEditMode() {
  const context = useContext(OwnerEditModeContext);

  if (!context) {
    throw new Error("Owner edit mode is only available inside its provider.");
  }

  return context;
}

export function OwnerSectionEditButton({
  isActive = false,
  label,
  onClick,
}: OwnerSectionEditButtonProps) {
  const { isEditMode } = useOwnerEditMode();

  if (!isEditMode) {
    return null;
  }

  return (
    <button
      type="button"
      aria-expanded={isActive}
      className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(19,140,124,0.18)] bg-white/76 px-3 py-1.5 text-sm font-semibold text-[color:var(--folio-accent-2)] shadow-[0_10px_24px_rgba(23,35,53,0.08)] backdrop-blur-sm transition hover:border-[color:rgba(19,140,124,0.3)] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--folio-accent-soft)]"
      onClick={onClick}
    >
      <Pencil className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

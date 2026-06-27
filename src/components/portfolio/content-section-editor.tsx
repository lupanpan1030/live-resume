"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import {
  OwnerSectionEditButton,
  useOwnerEditMode,
} from "@/components/portfolio/owner-edit-mode";
import type { ContentSectionName } from "@/lib/store";

type DraftUpdater<T> = (update: (current: T) => T) => void;

type ContentSectionEditorProps<T> = {
  children: (draft: T, updateDraft: DraftUpdater<T>) => ReactNode;
  panelTitle: string;
  sectionLabel: string;
  sectionName: ContentSectionName;
  value: T;
};

type TextFieldProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  type?: "text" | "url";
  value: string;
};

type StringListEditorProps = {
  addLabel?: string;
  idBase: string;
  items: string[];
  label: string;
  minRows?: number;
  onChange: (items: string[]) => void;
};

type ObjectListEditorProps<T> = {
  addLabel?: string;
  createItem: () => T;
  getItemTitle?: (item: T, index: number) => string;
  items: T[];
  label: string;
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    updateItem: (item: T) => void
  ) => ReactNode;
};

function cloneDraft<T>(value: T): T {
  return structuredClone(value);
}

export function replaceArrayItem<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function appendArrayItem<T>(items: T[], value: T) {
  return [...items, value];
}

function removeArrayItem<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function fieldInputClassName() {
  return "mt-2 block w-full rounded-2xl border border-[color:var(--folio-line)] bg-white/82 px-4 py-3 text-sm leading-6 text-[color:var(--folio-ink)] outline-none transition focus:border-[color:var(--folio-accent)] focus:ring-4 focus:ring-[color:var(--folio-accent-soft)]";
}

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor: string;
}) {
  return (
    <label
      className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  onChange,
  rows = 1,
  type = "text",
  value,
}: TextFieldProps) {
  const isMultiline = rows > 1;

  return (
    <label className="block">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {isMultiline ? (
        <textarea
          className={fieldInputClassName()}
          id={id}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={fieldInputClassName()}
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export function StringListEditor({
  addLabel,
  idBase,
  items,
  label,
  minRows = 1,
  onChange,
}: StringListEditorProps) {
  const headingId = useId();

  return (
    <div
      aria-labelledby={headingId}
      className="rounded-2xl border border-[color:var(--folio-line)] bg-white/54 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]"
          id={headingId}
        >
          {label}
        </p>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(19,140,124,0.18)] bg-white/78 px-3 py-1.5 text-sm font-semibold text-[color:var(--folio-accent-2)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--folio-accent-soft)]"
          type="button"
          onClick={() => onChange(appendArrayItem(items, ""))}
        >
          <Plus className="h-4 w-4" />
          <span>{addLabel ?? `Add ${label.toLowerCase()}`}</span>
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {items.map((item, index) => {
          const fieldId = `${idBase}-${index}`;

          return (
            <div
              className="grid gap-2 rounded-2xl border border-[color:rgba(23,35,53,0.06)] bg-white/68 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
              key={fieldId}
            >
              <label className="block min-w-0">
                <span className="sr-only">
                  {label} item {index + 1}
                </span>
                <textarea
                  className={fieldInputClassName()}
                  id={fieldId}
                  rows={minRows}
                  value={item}
                  onChange={(event) =>
                    onChange(replaceArrayItem(items, index, event.target.value))
                  }
                />
              </label>
              <button
                aria-label={`Remove ${label} item ${index + 1}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white/78 text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                title="Remove"
                type="button"
                onClick={() => onChange(removeArrayItem(items, index))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ObjectListEditor<T>({
  addLabel,
  createItem,
  getItemTitle,
  items,
  label,
  onChange,
  renderItem,
}: ObjectListEditorProps<T>) {
  const headingId = useId();

  return (
    <div
      aria-labelledby={headingId}
      className="rounded-2xl border border-[color:var(--folio-line)] bg-white/54 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]"
          id={headingId}
        >
          {label}
        </p>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(19,140,124,0.18)] bg-white/78 px-3 py-1.5 text-sm font-semibold text-[color:var(--folio-accent-2)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--folio-accent-soft)]"
          type="button"
          onClick={() => onChange(appendArrayItem(items, createItem()))}
        >
          <Plus className="h-4 w-4" />
          <span>{addLabel ?? `Add ${label.toLowerCase()}`}</span>
        </button>
      </div>

      <div className="mt-3 grid gap-4">
        {items.map((item, index) => {
          const itemTitle = getItemTitle?.(item, index) ?? `${label} ${index + 1}`;

          return (
            <section
              aria-label={itemTitle}
              className="rounded-2xl border border-[color:rgba(23,35,53,0.06)] bg-white/68 p-3 sm:p-4"
              key={`${itemTitle}-${index}`}
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-[color:var(--folio-line)] pb-3">
                <p className="min-w-0 truncate text-sm font-semibold text-[color:var(--folio-ink)]">
                  {itemTitle}
                </p>
                <button
                  aria-label={`Remove ${itemTitle}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white/78 text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                  title="Remove"
                  type="button"
                  onClick={() => onChange(removeArrayItem(items, index))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {renderItem(item, index, (nextItem) =>
                onChange(replaceArrayItem(items, index, nextItem))
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function ContentSectionEditor<T>({
  children,
  panelTitle,
  sectionLabel,
  sectionName,
  value,
}: ContentSectionEditorProps<T>) {
  const router = useRouter();
  const { isEditMode } = useOwnerEditMode();
  const [draft, setDraft] = useState(() => cloneDraft(value));
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const normalizedLabel = sectionLabel.toLowerCase();

  useEffect(() => {
    setDraft(cloneDraft(value));
  }, [value]);

  useEffect(() => {
    if (!isEditMode) {
      setIsOpen(false);
      setError(null);
    }
  }, [isEditMode]);

  function updateDraft(update: (current: T) => T) {
    setDraft((current) => update(current));
    setError(null);
    setStatus(null);
  }

  async function saveSection() {
    setError(null);
    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/content/${sectionName}`, {
        body: JSON.stringify(draft),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Save failed.");
      }

      setIsOpen(false);
      setStatus(`${sectionLabel} saved.`);
      router.refresh();
    } catch {
      setError(`Could not save ${normalizedLabel} changes.`);
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEditing() {
    setDraft(cloneDraft(value));
    setError(null);
    setIsOpen(false);
    setStatus(null);
  }

  return (
    <div className="mb-8">
      <div className="flex justify-end">
        <OwnerSectionEditButton
          isActive={isOpen}
          label={`Edit ${normalizedLabel}`}
          onClick={() => setIsOpen((current) => !current)}
        />
      </div>

      {status && !isOpen ? (
        <p
          className="mt-3 text-right text-sm font-medium text-[color:var(--folio-accent-2)]"
          role="status"
        >
          {status}
        </p>
      ) : null}

      {isOpen ? (
        <div className="mt-4 rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-[0_22px_56px_rgba(23,35,53,0.08)] backdrop-blur-md sm:p-6">
          <div className="border-b border-[color:var(--folio-line)] pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--folio-soft)]">
              {sectionLabel} section
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--folio-ink)]">
              {panelTitle}
            </h3>
          </div>

          <div className="mt-6 grid gap-5">{children(draft, updateDraft)}</div>

          {error ? (
            <p className="mt-5 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[color:var(--folio-line)] pt-5 sm:flex-row sm:justify-end">
            <button
              className="folio-button-secondary justify-center"
              disabled={isSaving}
              type="button"
              onClick={cancelEditing}
            >
              <span>Cancel</span>
            </button>
            <button
              className="folio-button justify-center"
              disabled={isSaving}
              type="button"
              onClick={saveSection}
            >
              <span>{isSaving ? "Saving" : `Save ${normalizedLabel}`}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

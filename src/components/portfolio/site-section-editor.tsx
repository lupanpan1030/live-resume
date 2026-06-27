"use client";

import type { NavItem, SiteContent } from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  SelectField,
  TextField,
} from "@/components/portfolio/content-section-editor";

type SiteSectionEditorProps = {
  site: SiteContent;
};

const blankNavItem: NavItem = {
  href: "",
  label: "",
};

const themeOptions: Array<{
  label: string;
  value: SiteContent["appearance"]["theme"];
}> = [
  { label: "Mist", value: "mist" },
  { label: "Sage", value: "sage" },
  { label: "Sand", value: "sand" },
  { label: "Slate", value: "slate" },
];

const gridOptions: Array<{
  label: string;
  value: SiteContent["appearance"]["grid"];
}> = [
  { label: "Lines", value: "lines" },
  { label: "Dots", value: "dots" },
  { label: "None", value: "none" },
];

export function SiteSectionEditor({ site }: SiteSectionEditorProps) {
  return (
    <ContentSectionEditor
      panelTitle="Edit global site content"
      sectionLabel="Site"
      sectionName="site"
      value={site}
    >
      {(draft, updateDraft) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              id="site-name"
              label="Name"
              value={draft.name}
              onChange={(name) =>
                updateDraft((current) => ({
                  ...current,
                  name,
                }))
              }
            />
            <TextField
              id="site-role"
              label="Role"
              value={draft.role}
              onChange={(role) =>
                updateDraft((current) => ({
                  ...current,
                  role,
                }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              id="site-location"
              label="Location"
              value={draft.location}
              onChange={(location) =>
                updateDraft((current) => ({
                  ...current,
                  location,
                }))
              }
            />
            <TextField
              id="site-availability"
              label="Availability"
              value={draft.availability}
              onChange={(availability) =>
                updateDraft((current) => ({
                  ...current,
                  availability,
                }))
              }
            />
          </div>

          <div className="rounded-2xl border border-[color:var(--folio-line)] bg-white/54 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]">
              Appearance
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SelectField
                id="site-appearance-theme"
                label="Background theme"
                options={themeOptions}
                value={draft.appearance.theme}
                onChange={(theme) =>
                  updateDraft((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      theme,
                    },
                  }))
                }
              />
              <SelectField
                id="site-appearance-grid"
                label="Grid style"
                options={gridOptions}
                value={draft.appearance.grid}
                onChange={(grid) =>
                  updateDraft((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      grid,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--folio-line)] bg-white/54 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]">
              SEO
            </p>
            <div className="mt-3 grid gap-3">
              <TextField
                id="site-seo-title"
                label="SEO title"
                value={draft.seo.title}
                onChange={(title) =>
                  updateDraft((current) => ({
                    ...current,
                    seo: {
                      ...current.seo,
                      title,
                    },
                  }))
                }
              />
              <TextField
                id="site-seo-description"
                label="SEO description"
                rows={3}
                value={draft.seo.description}
                onChange={(description) =>
                  updateDraft((current) => ({
                    ...current,
                    seo: {
                      ...current.seo,
                      description,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--folio-line)] bg-white/54 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]">
              CV
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextField
                id="site-cv-label"
                label="CV label"
                value={draft.cv.label}
                onChange={(label) =>
                  updateDraft((current) => ({
                    ...current,
                    cv: {
                      ...current.cv,
                      label,
                    },
                  }))
                }
              />
              <TextField
                id="site-cv-href"
                label="CV href"
                value={draft.cv.href ?? ""}
                onChange={(href) =>
                  updateDraft((current) => ({
                    ...current,
                    cv: {
                      ...current.cv,
                      href,
                    },
                  }))
                }
              />
            </div>
          </div>

          <ObjectListEditor
            addLabel="Add nav item"
            createItem={() => ({ ...blankNavItem })}
            getItemTitle={(item, index) => item.label || `Nav item ${index + 1}`}
            items={draft.nav}
            label="Navigation"
            onChange={(nav) =>
              updateDraft((current) => ({
                ...current,
                nav,
              }))
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  id={`site-nav-label-${index}`}
                  label="Label"
                  value={item.label}
                  onChange={(label) => updateItem({ ...item, label })}
                />
                <TextField
                  id={`site-nav-href-${index}`}
                  label="Href"
                  value={item.href}
                  onChange={(href) => updateItem({ ...item, href })}
                />
              </div>
            )}
          />

          <div className="rounded-2xl border border-[color:var(--folio-line)] bg-white/54 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--folio-soft)]">
              UI labels
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextField
                id="site-ui-evidence-label"
                label="Evidence label"
                value={draft.ui.evidenceLabel}
                onChange={(evidenceLabel) =>
                  updateDraft((current) => ({
                    ...current,
                    ui: {
                      ...current.ui,
                      evidenceLabel,
                    },
                  }))
                }
              />
              <TextField
                id="site-ui-focus-label"
                label="Focus label"
                value={draft.ui.focusLabel}
                onChange={(focusLabel) =>
                  updateDraft((current) => ({
                    ...current,
                    ui: {
                      ...current.ui,
                      focusLabel,
                    },
                  }))
                }
              />
              <TextField
                id="site-ui-section-suffix"
                label="Section suffix"
                value={draft.ui.sectionSuffix}
                onChange={(sectionSuffix) =>
                  updateDraft((current) => ({
                    ...current,
                    ui: {
                      ...current.ui,
                      sectionSuffix,
                    },
                  }))
                }
              />
              <TextField
                id="site-ui-skip-label"
                label="Skip label"
                value={draft.ui.skipToContentLabel}
                onChange={(skipToContentLabel) =>
                  updateDraft((current) => ({
                    ...current,
                    ui: {
                      ...current.ui,
                      skipToContentLabel,
                    },
                  }))
                }
              />
            </div>
          </div>
        </>
      )}
    </ContentSectionEditor>
  );
}

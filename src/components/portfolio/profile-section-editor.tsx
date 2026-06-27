"use client";

import type { FocusItem, ProfileContent } from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  StringListEditor,
  TextField,
} from "@/components/portfolio/content-section-editor";

type ProfileSectionEditorProps = {
  className?: string;
  panelClassName?: string;
  panelTitle?: string;
  profile: ProfileContent;
  sectionLabel?: string;
};

const blankFocusItem: FocusItem = {
  label: "",
  value: "",
};

export function ProfileSectionEditor({
  className,
  panelClassName,
  panelTitle = "Edit public profile copy",
  profile,
  sectionLabel = "Profile",
}: ProfileSectionEditorProps) {
  return (
    <ContentSectionEditor
      className={className}
      panelClassName={panelClassName}
      panelTitle={panelTitle}
      sectionLabel={sectionLabel}
      sectionName="profile"
      value={profile}
    >
      {(draft, updateDraft) => (
        <>
          <TextField
            id="profile-header-aria"
            label="Header intro aria label"
            value={draft.headerIntro.ariaLabel}
            onChange={(ariaLabel) =>
              updateDraft((current) => ({
                ...current,
                headerIntro: {
                  ...current.headerIntro,
                  ariaLabel,
                },
              }))
            }
          />

          <StringListEditor
            addLabel="Add intro line"
            idBase="header-intro-lines"
            items={draft.headerIntro.lines}
            label="Header intro lines"
            onChange={(lines) =>
              updateDraft((current) => ({
                ...current,
                headerIntro: {
                  ...current.headerIntro,
                  lines,
                },
              }))
            }
          />

          <TextField
            id="profile-title"
            label="Headline"
            rows={3}
            value={draft.title}
            onChange={(title) =>
              updateDraft((current) => ({
                ...current,
                title,
              }))
            }
          />

          <TextField
            id="profile-intro"
            label="Intro"
            rows={4}
            value={draft.intro}
            onChange={(intro) =>
              updateDraft((current) => ({
                ...current,
                intro,
              }))
            }
          />

          <StringListEditor
            addLabel="Add meta line"
            idBase="meta-line"
            items={draft.metaLine}
            label="Meta line"
            onChange={(metaLine) =>
              updateDraft((current) => ({
                ...current,
                metaLine,
              }))
            }
          />

          <StringListEditor
            addLabel="Add proof chip"
            idBase="proof-chips"
            items={draft.proofs}
            label="Proof chips"
            onChange={(proofs) =>
              updateDraft((current) => ({
                ...current,
                proofs,
              }))
            }
          />

          <ObjectListEditor
            addLabel="Add focus item"
            createItem={() => ({ ...blankFocusItem })}
            getItemTitle={(item, index) =>
              item.value || item.label || `Focus item ${index + 1}`
            }
            items={draft.focus}
            label="Focus items"
            onChange={(focus) =>
              updateDraft((current) => ({
                ...current,
                focus,
              }))
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid gap-3 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
                <TextField
                  id={`profile-focus-label-${index}`}
                  label="Label"
                  value={item.label}
                  onChange={(label) => updateItem({ ...item, label })}
                />
                <TextField
                  id={`profile-focus-value-${index}`}
                  label="Value"
                  value={item.value}
                  onChange={(value) => updateItem({ ...item, value })}
                />
              </div>
            )}
          />

          <TextField
            id="profile-summary"
            label="Summary"
            rows={4}
            value={draft.summary}
            onChange={(summary) =>
              updateDraft((current) => ({
                ...current,
                summary,
              }))
            }
          />

          <TextField
            id="profile-overview-title"
            label="Overview title"
            value={draft.overview.title}
            onChange={(title) =>
              updateDraft((current) => ({
                ...current,
                overview: {
                  ...current.overview,
                  title,
                },
              }))
            }
          />

          <StringListEditor
            addLabel="Add overview paragraph"
            idBase="overview-paragraphs"
            items={draft.overview.paragraphs}
            label="Overview paragraphs"
            minRows={4}
            onChange={(paragraphs) =>
              updateDraft((current) => ({
                ...current,
                overview: {
                  ...current.overview,
                  paragraphs,
                },
              }))
            }
          />
        </>
      )}
    </ContentSectionEditor>
  );
}

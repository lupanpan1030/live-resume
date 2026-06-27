"use client";

import type { EducationContent, EducationItem } from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  StringListEditor,
  TextField,
} from "@/components/portfolio/content-section-editor";

type EducationSectionEditorProps = {
  education: EducationContent;
};

const blankEducationItem: EducationItem = {
  degree: "",
  details: [],
  period: "",
  school: "",
};

export function EducationSectionEditor({
  education,
}: EducationSectionEditorProps) {
  return (
    <ContentSectionEditor
      panelTitle="Edit education entries"
      sectionLabel="Education"
      sectionName="education"
      value={education}
    >
      {(draft, updateDraft) => (
        <>
          <TextField
            id="education-title"
            label="Title"
            value={draft.title}
            onChange={(title) =>
              updateDraft((current) => ({
                ...current,
                title,
              }))
            }
          />

          <TextField
            id="education-intro"
            label="Intro"
            rows={3}
            value={draft.intro}
            onChange={(intro) =>
              updateDraft((current) => ({
                ...current,
                intro,
              }))
            }
          />

          <ObjectListEditor
            addLabel="Add education item"
            createItem={() => ({ ...blankEducationItem, details: [] })}
            getItemTitle={(item, index) =>
              item.degree || item.school || `Education item ${index + 1}`
            }
            items={draft.items}
            label="Education items"
            onChange={(items) =>
              updateDraft((current) => ({
                ...current,
                items,
              }))
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    id={`education-school-${index}`}
                    label="School"
                    value={item.school}
                    onChange={(school) => updateItem({ ...item, school })}
                  />
                  <TextField
                    id={`education-degree-${index}`}
                    label="Degree"
                    value={item.degree}
                    onChange={(degree) => updateItem({ ...item, degree })}
                  />
                </div>
                <TextField
                  id={`education-period-${index}`}
                  label="Period"
                  value={item.period}
                  onChange={(period) => updateItem({ ...item, period })}
                />
                <StringListEditor
                  addLabel="Add detail"
                  idBase={`education-details-${index}`}
                  items={item.details}
                  label="Details"
                  onChange={(details) => updateItem({ ...item, details })}
                />
              </div>
            )}
          />
        </>
      )}
    </ContentSectionEditor>
  );
}

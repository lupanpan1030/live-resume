"use client";

import type { SkillsContent } from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  StringListEditor,
  TextField,
} from "@/components/portfolio/content-section-editor";

type SkillsSectionEditorProps = {
  skills: SkillsContent;
};

type SkillGroup = SkillsContent["groups"][number];

const blankSkillGroup: SkillGroup = {
  items: [],
  label: "",
};

export function SkillsSectionEditor({ skills }: SkillsSectionEditorProps) {
  return (
    <ContentSectionEditor
      panelTitle="Edit skill groups"
      sectionLabel="Skills"
      sectionName="skills"
      value={skills}
    >
      {(draft, updateDraft) => (
        <>
          <TextField
            id="skills-title"
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
            id="skills-intro"
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
            addLabel="Add skill group"
            createItem={() => ({ ...blankSkillGroup, items: [] })}
            getItemTitle={(item, index) => item.label || `Skill group ${index + 1}`}
            items={draft.groups}
            label="Skill groups"
            onChange={(groups) =>
              updateDraft((current) => ({
                ...current,
                groups,
              }))
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid gap-4">
                <TextField
                  id={`skill-group-label-${index}`}
                  label="Group label"
                  value={item.label}
                  onChange={(label) => updateItem({ ...item, label })}
                />
                <StringListEditor
                  addLabel="Add skill"
                  idBase={`skill-group-items-${index}`}
                  items={item.items}
                  label="Skills"
                  onChange={(items) => updateItem({ ...item, items })}
                />
              </div>
            )}
          />
        </>
      )}
    </ContentSectionEditor>
  );
}

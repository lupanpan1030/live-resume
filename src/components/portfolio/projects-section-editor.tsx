"use client";

import type { ProjectItem, ProjectsContent } from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  TextField,
} from "@/components/portfolio/content-section-editor";

type ProjectsSectionEditorProps = {
  projects: ProjectsContent;
};

const blankProjectItem: ProjectItem = {
  cta: "",
  description: "",
  href: "",
  label: "",
  meta: "",
  title: "",
};

export function ProjectsSectionEditor({ projects }: ProjectsSectionEditorProps) {
  return (
    <ContentSectionEditor
      panelTitle="Edit project cards"
      sectionLabel="Projects"
      sectionName="projects"
      value={projects}
    >
      {(draft, updateDraft) => (
        <>
          <TextField
            id="projects-title"
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
            id="projects-intro"
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
            addLabel="Add project"
            createItem={() => ({ ...blankProjectItem })}
            getItemTitle={(item, index) =>
              item.title || item.label || `Project ${index + 1}`
            }
            items={draft.items}
            label="Projects"
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
                    id={`project-label-${index}`}
                    label="Label"
                    value={item.label}
                    onChange={(label) => updateItem({ ...item, label })}
                  />
                  <TextField
                    id={`project-title-${index}`}
                    label="Title"
                    value={item.title}
                    onChange={(title) => updateItem({ ...item, title })}
                  />
                </div>
                <TextField
                  id={`project-meta-${index}`}
                  label="Meta"
                  value={item.meta}
                  onChange={(meta) => updateItem({ ...item, meta })}
                />
                <TextField
                  id={`project-description-${index}`}
                  label="Description"
                  rows={3}
                  value={item.description}
                  onChange={(description) =>
                    updateItem({ ...item, description })
                  }
                />
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
                  <TextField
                    id={`project-href-${index}`}
                    label="Href"
                    type="url"
                    value={item.href}
                    onChange={(href) => updateItem({ ...item, href })}
                  />
                  <TextField
                    id={`project-cta-${index}`}
                    label="CTA"
                    value={item.cta}
                    onChange={(cta) => updateItem({ ...item, cta })}
                  />
                </div>
              </div>
            )}
          />
        </>
      )}
    </ContentSectionEditor>
  );
}

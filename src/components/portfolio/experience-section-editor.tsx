"use client";

import type {
  ExperienceContent,
  ExperienceHighlight,
  ExperienceItem,
} from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  StringListEditor,
  TextField,
} from "@/components/portfolio/content-section-editor";

type ExperienceSectionEditorProps = {
  experience: ExperienceContent;
};

const blankExperienceHighlight: ExperienceHighlight = {
  description: "",
  skills: [],
  title: "",
};

const blankExperienceItem: ExperienceItem = {
  company: "",
  highlights: [],
  period: "",
  role: "",
  summary: "",
};

export function ExperienceSectionEditor({
  experience,
}: ExperienceSectionEditorProps) {
  return (
    <ContentSectionEditor
      panelTitle="Edit experience entries"
      sectionLabel="Experience"
      sectionName="experience"
      value={experience}
    >
      {(draft, updateDraft) => (
        <>
          <TextField
            id="experience-title"
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
            id="experience-intro"
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
            addLabel="Add experience item"
            createItem={() => ({
              ...blankExperienceItem,
              highlights: [],
            })}
            getItemTitle={(item, index) =>
              item.role || item.company || `Experience item ${index + 1}`
            }
            items={draft.items}
            label="Experience items"
            onChange={(items) =>
              updateDraft((current) => ({
                ...current,
                items,
              }))
            }
            renderItem={(item, itemIndex, updateItem) => (
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    id={`experience-company-${itemIndex}`}
                    label="Company"
                    value={item.company}
                    onChange={(company) => updateItem({ ...item, company })}
                  />
                  <TextField
                    id={`experience-role-${itemIndex}`}
                    label="Role"
                    value={item.role}
                    onChange={(role) => updateItem({ ...item, role })}
                  />
                </div>
                <TextField
                  id={`experience-period-${itemIndex}`}
                  label="Period"
                  value={item.period}
                  onChange={(period) => updateItem({ ...item, period })}
                />
                <TextField
                  id={`experience-summary-${itemIndex}`}
                  label="Summary"
                  rows={3}
                  value={item.summary}
                  onChange={(summary) => updateItem({ ...item, summary })}
                />

                <ObjectListEditor
                  addLabel="Add highlight"
                  createItem={() => ({
                    ...blankExperienceHighlight,
                    skills: [],
                  })}
                  getItemTitle={(highlight, highlightIndex) =>
                    highlight.title || `Highlight ${highlightIndex + 1}`
                  }
                  items={item.highlights}
                  label="Highlights"
                  onChange={(highlights) => updateItem({ ...item, highlights })}
                  renderItem={(highlight, highlightIndex, updateHighlight) => (
                    <div className="grid gap-4">
                      <TextField
                        id={`experience-highlight-title-${itemIndex}-${highlightIndex}`}
                        label="Highlight title"
                        value={highlight.title}
                        onChange={(title) =>
                          updateHighlight({ ...highlight, title })
                        }
                      />
                      <TextField
                        id={`experience-highlight-description-${itemIndex}-${highlightIndex}`}
                        label="Description"
                        rows={3}
                        value={highlight.description}
                        onChange={(description) =>
                          updateHighlight({ ...highlight, description })
                        }
                      />
                      <StringListEditor
                        addLabel="Add skill"
                        idBase={`experience-highlight-skills-${itemIndex}-${highlightIndex}`}
                        items={highlight.skills}
                        label="Skills"
                        onChange={(skills) =>
                          updateHighlight({ ...highlight, skills })
                        }
                      />
                    </div>
                  )}
                />
              </div>
            )}
          />
        </>
      )}
    </ContentSectionEditor>
  );
}

"use client";

import type { ContactContent, ContactLink } from "@/content";
import {
  ContentSectionEditor,
  ObjectListEditor,
  TextField,
} from "@/components/portfolio/content-section-editor";

type ContactSectionEditorProps = {
  contact: ContactContent;
};

const blankContactLink: ContactLink = {
  href: "",
  label: "",
  value: "",
};

export function ContactSectionEditor({ contact }: ContactSectionEditorProps) {
  return (
    <ContentSectionEditor
      panelTitle="Edit contact details"
      sectionLabel="Contact"
      sectionName="contact"
      value={contact}
    >
      {(draft, updateDraft) => (
        <>
          <TextField
            id="contact-title"
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
            id="contact-description"
            label="Description"
            rows={3}
            value={draft.description}
            onChange={(description) =>
              updateDraft((current) => ({
                ...current,
                description,
              }))
            }
          />

          <ObjectListEditor
            addLabel="Add contact link"
            createItem={() => ({ ...blankContactLink })}
            getItemTitle={(item, index) =>
              item.label || item.value || `Contact link ${index + 1}`
            }
            items={draft.links}
            label="Contact links"
            onChange={(links) =>
              updateDraft((current) => ({
                ...current,
                links,
              }))
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    id={`contact-link-label-${index}`}
                    label="Label"
                    value={item.label}
                    onChange={(label) => updateItem({ ...item, label })}
                  />
                  <TextField
                    id={`contact-link-value-${index}`}
                    label="Value"
                    value={item.value}
                    onChange={(value) => updateItem({ ...item, value })}
                  />
                </div>
                <TextField
                  id={`contact-link-href-${index}`}
                  label="Href"
                  type="url"
                  value={item.href ?? ""}
                  onChange={(href) => updateItem({ ...item, href })}
                />
              </div>
            )}
          />
        </>
      )}
    </ContentSectionEditor>
  );
}

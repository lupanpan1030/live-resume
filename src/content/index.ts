import contactJson from "../../content/contact.json";
import educationJson from "../../content/education.json";
import experienceJson from "../../content/experience.json";
import profileJson from "../../content/profile.json";
import projectsJson from "../../content/projects.json";
import skillsJson from "../../content/skills.json";
import siteJson from "../../content/site.json";
import { contentStore, type StoredResumeContent } from "@/lib/store";

export type NavItem = {
  href: string;
  label: string;
};

export type FocusItem = {
  label: string;
  value: string;
};

export type HeaderIntro = {
  ariaLabel: string;
  lines: string[];
};

export type ExperienceHighlight = {
  description: string;
  skills: string[];
  title: string;
};

export type ExperienceItem = {
  company: string;
  highlights: ExperienceHighlight[];
  period: string;
  role: string;
  summary: string;
};

export type EducationItem = {
  details: string[];
  degree: string;
  period: string;
  school: string;
};

export type ContactLink = {
  href?: string;
  label: string;
  value: string;
};

export type ProjectItem = {
  cta: string;
  description: string;
  href: string;
  label: string;
  meta: string;
  title: string;
};

export type SiteContent = {
  appearance: {
    grid: string;
    theme: string;
  };
  availability: string;
  cv: {
    href: string | null;
    label: string;
  };
  location: string;
  name: string;
  nav: NavItem[];
  role: string;
  seo: {
    description: string;
    title: string;
  };
  ui: {
    evidenceLabel: string;
    focusLabel: string;
    sectionSuffix: string;
    skipToContentLabel: string;
  };
};

export type ProfileContent = {
  focus: FocusItem[];
  headerIntro: HeaderIntro;
  intro: string;
  metaLine: string[];
  overview: {
    paragraphs: string[];
    title: string;
  };
  proofs: string[];
  summary: string;
  title: string;
};

export type ExperienceContent = {
  intro: string;
  items: ExperienceItem[];
  title: string;
};

export type ProjectsContent = {
  intro: string;
  items: ProjectItem[];
  title: string;
};

export type SkillsContent = {
  groups: Array<{
    items: string[];
    label: string;
  }>;
  intro: string;
  title: string;
};

export type EducationContent = {
  intro: string;
  items: EducationItem[];
  title: string;
};

export type ContactContent = {
  description: string;
  links: ContactLink[];
  title: string;
};

export type ResumeContent = {
  contact: ContactContent;
  education: EducationContent;
  experience: ExperienceContent;
  nav: NavItem[];
  overview: ProfileContent["overview"];
  profile: ProfileContent & {
    availability: string;
    location: string;
    name: string;
    role: string;
  };
  projects: ProjectsContent;
  seo: SiteContent["seo"];
  site: SiteContent;
  skills: SkillsContent;
  ui: SiteContent["ui"];
};

export type DownloadAsset = {
  href: string | null;
  label: string;
  unavailableLabel: string;
};

export const site = siteJson satisfies SiteContent;
export const profile = profileJson satisfies ProfileContent;
export const experience = experienceJson satisfies ExperienceContent;
export const projects = projectsJson satisfies ProjectsContent;
export const skills = skillsJson satisfies SkillsContent;
export const education = educationJson satisfies EducationContent;
export const contact = contactJson satisfies ContactContent;

function withSiteDefaults(siteContent: SiteContent): SiteContent {
  return {
    ...siteContent,
    appearance: siteContent.appearance ?? site.appearance,
  };
}

function buildResumeContent({
  contact,
  education,
  experience,
  profile,
  projects,
  site,
  skills,
}: StoredResumeContent): ResumeContent {
  const normalizedSite = withSiteDefaults(site);

  return {
    contact,
    education,
    experience,
    nav: normalizedSite.nav,
    overview: profile.overview,
    profile: {
      ...profile,
      availability: normalizedSite.availability,
      location: normalizedSite.location,
      name: normalizedSite.name,
      role: normalizedSite.role,
    },
    projects,
    seo: normalizedSite.seo,
    site: normalizedSite,
    skills,
    ui: normalizedSite.ui,
  };
}

export async function getResumeContent(): Promise<ResumeContent> {
  return buildResumeContent(await contentStore.getContent());
}

export async function getCvDownload(): Promise<DownloadAsset> {
  const content = await getResumeContent();

  return {
    ...content.site.cv,
    unavailableLabel: "CV file not added yet",
  };
}

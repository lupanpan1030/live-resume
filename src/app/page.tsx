import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { HashAnchorScroll } from "@/components/portfolio/hash-anchor-scroll";
import { SiteHeader } from "@/components/portfolio/site-header";
import { ContactSectionEditor } from "@/components/portfolio/contact-section-editor";
import { ContactEmailActions } from "@/components/portfolio/contact-email-actions";
import { EducationSectionEditor } from "@/components/portfolio/education-section-editor";
import { PageBackdropTracker } from "@/components/portfolio/page-backdrop-tracker";
import { ExperienceSectionEditor } from "@/components/portfolio/experience-section-editor";
import { ProfileSectionEditor } from "@/components/portfolio/profile-section-editor";
import { HeroResumeTransition } from "@/components/portfolio/hero-resume-transition";
import { PortfolioCharacterScene } from "@/components/portfolio/portfolio-character-scene";
import {
  OwnerEditModeProvider,
} from "@/components/portfolio/owner-edit-mode";
import { OwnerModeIndicator } from "@/components/portfolio/owner-mode-indicator";
import { ProjectsSectionEditor } from "@/components/portfolio/projects-section-editor";
import { ResumeHeaderGate } from "@/components/portfolio/resume-header-gate";
import { SectionNav } from "@/components/portfolio/section-nav";
import { SiteSectionEditor } from "@/components/portfolio/site-section-editor";
import { SkillsSectionEditor } from "@/components/portfolio/skills-section-editor";
import {
  getCvDownload,
  getResumeContent,
  type ProfileContent,
  type ResumeContent,
} from "@/content";
import { isAuthed } from "@/lib/auth";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type SectionHeaderProps = {
  action?: ReactNode;
  suffix: string;
  title: string;
};

type SidebarContactStripProps = {
  ariaLabel: string;
  contactLinks: ResumeContent["contact"]["links"];
};

const contactIcons = {
  Email: Mail,
  GitHub: Github,
  LinkedIn: Linkedin,
};

function SectionHeader({ action, suffix, title }: SectionHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-1 items-end gap-5">
          <h2
            aria-label={`${title} ${suffix}`}
            className="shrink-0 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--folio-ink)] sm:text-4xl"
          >
            {title}
          </h2>
          <span className="folio-divider mb-2 hidden sm:block" aria-hidden="true" />
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

function SidebarContactStrip({
  ariaLabel,
  contactLinks,
}: SidebarContactStripProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="mt-2 max-w-md pt-3 xl:mt-auto"
    >
      <div className="folio-contact-icon-rail inline-flex items-center gap-1.5 rounded-full px-1.5 py-1 backdrop-blur-sm">
        {contactLinks
          .filter((item) => item.href)
          .map((item) => {
            const Icon =
              contactIcons[item.label as keyof typeof contactIcons] ??
              ArrowUpRight;
            const isExternal = item.href?.startsWith("http") ?? false;

            return (
              <Link
                key={item.label}
                href={item.href ?? "#contact"}
                className="folio-contact-icon-button cursor-pointer"
                aria-label={`${item.label}: ${item.value}`}
                title={item.value}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              >
                <Icon className="h-[18px] w-[18px]" />
              </Link>
            );
          })}
      </div>
    </nav>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getResumeContent();

  return buildMetadata({
    title: content.seo.title,
    description: content.seo.description,
    siteName: content.site.name,
    path: "/",
  });
}

export default async function Home() {
  const [content, cvDownload, ownerIsAuthed] = await Promise.all([
    getResumeContent(),
    getCvDownload(),
    isAuthed(),
  ]);
  const projects = content.projects.items;
  const editableProfile: ProfileContent = {
    focus: content.profile.focus,
    headerIntro: content.profile.headerIntro,
    intro: content.profile.intro,
    metaLine: content.profile.metaLine,
    overview: content.profile.overview,
    proofs: content.profile.proofs,
    summary: content.profile.summary,
    title: content.profile.title,
  };

  const uiCopy = {
    projectsCta: "View projects",
    contactPrimaryCta: "Email me",
    contactPrimaryLabel: "Direct contact",
    contactCopyCta: "Copy email",
    contactCopiedCta: "Copied",
    contactCopyError: "Copy failed",
    contactSecondaryLabel: "Elsewhere",
    contactSecondaryNav: "Other contact links",
  };
  const primaryContactLink =
    content.contact.links.find((item) => item.href?.startsWith("mailto:")) ??
    content.contact.links.find((item) => item.href);
  const secondaryContactLinks = content.contact.links.filter(
    (item) => item !== primaryContactLink && Boolean(item.href),
  );

  const page = (
    <PageBackdropTracker
      appearance={content.site.appearance}
      className="folio-page"
    >
      <HashAnchorScroll />
      {ownerIsAuthed ? <OwnerModeIndicator /> : null}

      <a
        href="#portfolio-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[color:var(--folio-preview)] focus:px-4 focus:py-2 focus:text-sm focus:text-[color:var(--folio-ink)]"
      >
        {content.ui.skipToContentLabel}
      </a>

      <HeroResumeTransition
        cvDownload={cvDownload}
        editor={
          ownerIsAuthed ? (
            <ProfileSectionEditor
              className="mb-0"
              panelClassName="max-h-[min(72svh,46rem)] overflow-y-auto"
              panelTitle="Edit hero and profile copy"
              profile={editableProfile}
              sectionLabel="Hero"
            />
          ) : null
        }
        profile={content.profile}
      />

      <ResumeHeaderGate>
        <SiteHeader
          content={content}
          cvDownload={cvDownload}
          position="fixed"
          className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12"
        />
      </ResumeHeaderGate>

      <div
        id="resume-header-sentinel"
        aria-hidden="true"
        className="pointer-events-none h-px w-full"
      />

      <div
        id="portfolio-resume"
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-16 lg:px-10 xl:px-12 xl:pb-20 xl:pt-28"
      >
        {ownerIsAuthed ? <SiteSectionEditor site={content.site} /> : null}

        <div className="mt-0 flex min-h-screen flex-col items-start gap-0 pb-0 xl:mt-8 xl:flex-row xl:gap-16">
          <header className="folio-aside-scroll mb-0 hidden w-full flex-col gap-6 overflow-visible py-6 xl:sticky xl:top-24 xl:flex xl:h-[calc(100svh-11rem)] xl:w-[36%] xl:gap-8 xl:overflow-y-auto xl:py-8 xl:pr-8">
            <div className="max-w-2xl xl:max-w-md">
              <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[color:var(--folio-ink)] sm:text-5xl xl:text-[3.4rem] xl:leading-[1.02] xl:tracking-[-0.055em]">
                {content.profile.name}
              </h1>
              <p className="mt-6 text-[1.08rem] leading-8 text-[color:var(--folio-ink)]">
                {content.profile.title}
              </p>
              <p className="mt-6 text-sm leading-7 text-[color:var(--folio-soft-strong)]">
                {content.profile.metaLine.join(" · ")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#projects" className="folio-button">
                  <span>{uiCopy.projectsCta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="hidden max-w-md xl:block">
              <PortfolioCharacterScene className="mb-3 h-[230px] min-h-[230px]" />
            </div>

            <div className="pt-4">
              <SectionNav items={content.nav} />
            </div>

            <SidebarContactStrip
              ariaLabel={content.contact.title}
              contactLinks={content.contact.links}
            />
          </header>

          <main id="portfolio-content" className="w-full py-0 xl:w-[64%] xl:py-20">
            <section id="overview" className="folio-section scroll-mt-44 md:scroll-mt-36 xl:scroll-mt-28">
              <SectionHeader
                suffix={content.ui.sectionSuffix}
                title={content.overview.title}
              />
              {ownerIsAuthed ? (
                <ProfileSectionEditor profile={editableProfile} />
              ) : null}
              <div className="max-w-3xl space-y-6 text-base leading-8 text-[color:var(--folio-muted)]">
                {content.overview.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="skills" className="folio-section scroll-mt-44 md:scroll-mt-36 xl:scroll-mt-28">
              <SectionHeader
                suffix={content.ui.sectionSuffix}
                title={content.skills.title}
              />
              {ownerIsAuthed ? (
                <SkillsSectionEditor skills={content.skills} />
              ) : null}
              <p className="max-w-3xl text-base leading-8 text-[color:var(--folio-muted)]">
                {content.skills.intro}
              </p>

              <div className="folio-stream mt-8">
                {content.skills.groups.map((group) => (
                  <section key={group.label} className="folio-experience-highlight">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-[color:var(--folio-ink)]">
                      {group.label}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span key={skill} className="folio-pill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section id="experience" className="folio-section scroll-mt-44 md:scroll-mt-36 xl:scroll-mt-28">
              <SectionHeader
                suffix={content.ui.sectionSuffix}
                title={content.experience.title}
              />
              {ownerIsAuthed ? (
                <ExperienceSectionEditor experience={content.experience} />
              ) : null}
              <p className="max-w-3xl text-base leading-8 text-[color:var(--folio-muted)]">
                {content.experience.intro}
              </p>

              <div className="folio-stream mt-8">
                {content.experience.items.map((item) => (
                  <article
                    key={`${item.period}-${item.company}`}
                    className="folio-stream-item group"
                  >
                    <div className="folio-experience-meta">
                      <p className="folio-kicker">{item.period}</p>
                      <span className="folio-experience-meta-rule hidden sm:block" aria-hidden="true" />
                      <p className="min-w-0 text-sm leading-snug text-[color:var(--folio-soft)]">
                        {item.company}
                      </p>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[color:var(--folio-ink)] transition-colors duration-200 ease-out group-hover:text-[color:var(--folio-accent)]">
                      {item.role}
                    </h3>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--folio-muted)]">
                      {item.summary}
                    </p>

                    <div className="mt-7 grid gap-5">
                      {item.highlights.map((highlight) => (
                        <section
                          key={highlight.title}
                          className="folio-experience-highlight"
                        >
                          <h4 className="text-base font-semibold tracking-[-0.02em] text-[color:var(--folio-ink)]">
                            {highlight.title}
                          </h4>
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--folio-muted)]">
                            {highlight.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {highlight.skills.map((skill) => (
                              <span key={skill} className="folio-pill">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

          <section id="projects" className="folio-section scroll-mt-44 md:scroll-mt-36 xl:scroll-mt-28">
            <SectionHeader
              suffix={content.ui.sectionSuffix}
              title={content.projects.title}
            />
            {ownerIsAuthed ? (
              <ProjectsSectionEditor projects={content.projects} />
            ) : null}
            <p className="max-w-3xl text-base leading-8 text-[color:var(--folio-muted)]">
              {content.projects.intro}
            </p>

            <div className="folio-case-grid mt-8">
              {projects.map((project) => {
                const isGitHubProject = project.href.includes("github.com");

                return (
                  <a
                    key={`${project.label}-${project.href}`}
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="folio-case-supplemental group"
                    aria-label={`${project.cta}: ${project.title}`}
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--folio-soft)]">
                        {project.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--folio-muted)]">
                        <span className="font-semibold text-[color:var(--folio-ink)] transition-colors duration-200 ease-out group-hover:text-[color:var(--folio-accent-2)]">
                          {project.title}
                        </span>
                        <span> — {project.description}</span>
                      </p>
                      <p className="mt-2 text-xs leading-6 text-[color:var(--folio-soft)]">
                        {project.meta}
                      </p>
                    </div>

                    <span className="folio-case-supplemental-link">
                      {isGitHubProject ? (
                        <Github className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                      <span>{project.cta}</span>
                      {isGitHubProject ? <ArrowUpRight className="h-4 w-4" /> : null}
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          <section id="education" className="folio-section scroll-mt-44 md:scroll-mt-36 xl:scroll-mt-28">
            <SectionHeader
              suffix={content.ui.sectionSuffix}
              title={content.education.title}
            />
            {ownerIsAuthed ? (
              <EducationSectionEditor education={content.education} />
            ) : null}
            <p className="max-w-3xl text-base leading-8 text-[color:var(--folio-muted)]">
              {content.education.intro}
            </p>

            <div className="folio-education-list mt-8">
              {content.education.items.map((item) => (
                <article
                  key={`${item.school}-${item.period}`}
                  className="folio-education-row group"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="folio-kicker mb-0">{item.period}</p>
                    <span className="hidden h-px w-7 bg-[color:var(--folio-line-strong)] sm:block" aria-hidden="true" />
                    <p className="text-sm text-[color:var(--folio-soft)]">
                      {item.school}
                    </p>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[color:var(--folio-ink)] transition-colors duration-200 ease-out group-hover:text-[color:var(--folio-accent)]">
                    {item.degree}
                  </h3>
                  <ul className="mt-4 grid gap-2 text-sm leading-7 text-[color:var(--folio-muted)]">
                    {item.details.map((detail) => (
                      <li key={detail} className="folio-education-detail">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="folio-section scroll-mt-44 md:scroll-mt-36 xl:scroll-mt-28"
          >
            <SectionHeader
              suffix={content.ui.sectionSuffix}
              title={content.contact.title}
            />
            {ownerIsAuthed ? (
              <ContactSectionEditor contact={content.contact} />
            ) : null}
            <div className="max-w-3xl">
              <p className="text-base leading-8 text-[color:var(--folio-muted)]">
                {content.contact.description}
              </p>

              {primaryContactLink ? (
                <div className="folio-contact-panel mt-8">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--folio-soft)]">
                      {uiCopy.contactPrimaryLabel}
                    </p>
                    <p className="mt-2 break-words text-lg font-semibold tracking-[-0.02em] text-[color:var(--folio-ink)]">
                      {primaryContactLink.value}
                    </p>
                  </div>
                  <ContactEmailActions
                    email={primaryContactLink.value}
                    mailtoHref={
                      primaryContactLink.href ?? `mailto:${primaryContactLink.value}`
                    }
                    mailLabel={uiCopy.contactPrimaryCta}
                    mailAriaLabel={`${uiCopy.contactPrimaryCta}: ${primaryContactLink.value}`}
                    copyLabel={uiCopy.contactCopyCta}
                    copiedLabel={uiCopy.contactCopiedCta}
                    copyErrorLabel={uiCopy.contactCopyError}
                    copyAriaLabel={`${uiCopy.contactCopyCta}: ${primaryContactLink.value}`}
                  />
                </div>
              ) : null}

              {secondaryContactLinks.length > 0 ? (
                <div className="folio-contact-links mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--folio-soft)]">
                    {uiCopy.contactSecondaryLabel}
                  </p>
                  <nav
                    aria-label={uiCopy.contactSecondaryNav}
                    className="mt-3 flex flex-wrap gap-3"
                  >
                    {secondaryContactLinks.map((item) => {
                      const Icon =
                        contactIcons[item.label as keyof typeof contactIcons] ??
                        ArrowUpRight;
                      const isExternal = item.href?.startsWith("http") ?? false;

                      return (
                        <Link
                          key={item.label}
                          href={item.href ?? "#contact"}
                          className="folio-contact-link group"
                          aria-label={`${item.label}: ${item.value}`}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-55 transition-opacity duration-200 ease-out group-hover:opacity-100" />
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ) : null}
            </div>
          </section>
          </main>
        </div>
      </div>
    </PageBackdropTracker>
  );

  return ownerIsAuthed ? (
    <OwnerEditModeProvider>{page}</OwnerEditModeProvider>
  ) : (
    page
  );
}

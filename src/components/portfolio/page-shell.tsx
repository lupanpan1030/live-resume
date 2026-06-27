import type { ReactNode } from "react";
import type { DownloadAsset, ResumeContent } from "@/content";
import { SiteHeader } from "./site-header";

type PageShellProps = {
  children: ReactNode;
  content: ResumeContent;
  cvDownload: DownloadAsset;
  intro: string;
  title: string;
};

export function PageShell({
  children,
  content,
  cvDownload,
  intro,
  title,
}: PageShellProps) {
  return (
    <div className="folio-page">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-10 sm:pt-6 lg:px-12">
        <SiteHeader content={content} cvDownload={cvDownload} />

        <main className="pt-12 lg:pt-16">
          <div className="max-w-5xl">
            <div className="max-w-3xl">
              <p className="folio-heading">{title}</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--folio-ink)] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-[color:var(--folio-muted)]">
                {intro}
              </p>
            </div>

            <div className="mt-14">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

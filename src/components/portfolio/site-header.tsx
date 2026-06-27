import Link from "next/link";
import { Download } from "lucide-react";
import { HeaderBrandIntro } from "@/components/portfolio/header-brand-intro";
import type { DownloadAsset, ResumeContent } from "@/content";

type SiteHeaderProps = {
  className?: string;
  content: ResumeContent;
  cvDownload: DownloadAsset;
  position?: "fixed" | "sticky";
};

export function SiteHeader({
  className,
  content,
  cvDownload,
  position = "sticky",
}: SiteHeaderProps) {
  const positionClass =
    position === "fixed" ? "fixed inset-x-0 top-4 z-50" : "sticky top-4 z-40";

  return (
    <div
      className={[positionClass, className].filter(Boolean).join(" ")}
    >
      <div className="folio-topbar">
        <HeaderBrandIntro
          href="/"
          intro={content.profile.headerIntro}
          name={content.profile.name}
        />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 xl:flex"
        >
          {content.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[color:var(--folio-muted)] transition-colors duration-200 ease-out hover:text-[color:var(--folio-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="folio-header-controls flex shrink-0 items-center gap-2 sm:gap-3">
          {cvDownload.href ? (
            <Link
              href={cvDownload.href}
              download
              className="folio-button-secondary folio-header-cv-button"
            >
              <span>{cvDownload.label}</span>
              <Download className="h-4 w-4" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="folio-button-secondary folio-header-cv-button cursor-not-allowed opacity-60"
              title={cvDownload.unavailableLabel}
            >
              <span>{cvDownload.label}</span>
              <Download className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

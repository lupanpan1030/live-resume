import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/portfolio/page-shell";
import { getCvDownload, getResumeContent } from "@/content";

type NotFoundCopy = {
  title: string;
  intro: string;
  homeCta: string;
};

const notFoundCopy: NotFoundCopy = {
  title: "Page not found",
  intro:
    "This page doesn’t exist or has moved. The link may be outdated, or the address was typed incorrectly.",
  homeCta: "Back to home",
};

export default async function NotFound() {
  const [content, cvDownload] = await Promise.all([
    getResumeContent(),
    getCvDownload(),
  ]);

  return (
    <PageShell
      content={content}
      cvDownload={cvDownload}
      intro={notFoundCopy.intro}
      title={notFoundCopy.title}
    >
      <Link href="/" className="folio-button">
        <ArrowLeft className="h-4 w-4" />
        <span>{notFoundCopy.homeCta}</span>
      </Link>
    </PageShell>
  );
}

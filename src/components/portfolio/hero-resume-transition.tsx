import { PortfolioHeroStageCard } from "@/components/portfolio/portfolio-hero-stage-card";
import type { DownloadAsset, ResumeContent } from "@/content";

type HeroResumeTransitionProps = {
  cvDownload: DownloadAsset;
  profile: ResumeContent["profile"];
};

export function HeroResumeTransition({
  cvDownload,
  profile,
}: HeroResumeTransitionProps) {
  return (
    <section
      id="portfolio-transition"
      aria-label="Resume hero"
      className="relative z-10 px-4 pb-8 pt-4 sm:px-6 lg:px-8 xl:px-12 xl:pb-12 xl:pt-8"
    >
      <div className="mx-auto max-w-7xl">
        <PortfolioHeroStageCard
          cvDownload={cvDownload}
          profile={profile}
          variant="hero"
        />
      </div>
    </section>
  );
}

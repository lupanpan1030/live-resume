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
      className="relative z-10 flex min-h-[100svh] items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <PortfolioHeroStageCard
          cardId="hero"
          cvDownload={cvDownload}
          profile={profile}
          showEntranceAnimation
          variant="hero"
        />
      </div>
    </section>
  );
}

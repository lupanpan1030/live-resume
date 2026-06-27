import { ArrowDown, ArrowRight, Download } from "lucide-react";
import type { CSSProperties } from "react";
import {
  HeroExperienceOrbit,
  type HeroExperienceOrbitMode,
} from "@/components/portfolio/hero-experience-orbit";
import { HeroPortraitCard } from "@/components/portfolio/hero-portrait-card";
import type { DownloadAsset, ResumeContent } from "@/content";
import { cn } from "@/lib/utils";

type PortfolioHeroStageCardProps = {
  className?: string;
  cvDownload: DownloadAsset;
  decorative?: boolean;
  profile: ResumeContent["profile"];
  showEntranceAnimation?: boolean;
  constellationMode?: HeroExperienceOrbitMode;
  variant?: "hero" | "screen";
  cardId?: string;
};

const cardCopy = {
  enterLabel: "View projects",
  portraitAlt: "Portrait placeholder",
  scrollHint: "Scroll to explore",
  downloadCvLabel: "Download CV",
};

function getEnterStyle(
  enabled: boolean,
  delayMs: number,
  distancePx = 14,
  blurPx = 6
) {
  if (!enabled) {
    return undefined;
  }

  return {
    "--folio-enter-delay": `${delayMs}ms`,
    "--folio-enter-distance": `${distancePx}px`,
    "--folio-enter-blur": `${blurPx}px`,
  } as CSSProperties;
}

export function PortfolioHeroStageCard({
  className,
  cvDownload,
  decorative = false,
  profile,
  showEntranceAnimation = false,
  constellationMode = "auto",
  variant = "hero",
  cardId,
}: PortfolioHeroStageCardProps) {
  const copy = cardCopy;
  const greeting = `Hi, I'm ${profile.name}`;
  const isHero = variant === "hero";
  const cardPaddingClass = isHero
    ? "px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7 lg:px-12 lg:pb-12 lg:pt-10 xl:px-16 xl:pb-14 xl:pt-12"
    : "px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-7 lg:px-10 lg:pb-10 lg:pt-9";
  const contentMaxWidthClass = isHero ? "max-w-[1128px]" : "max-w-none";
  const gridClass = isHero
    ? "grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_392px] xl:gap-16"
    : "grid-cols-1 gap-7 md:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-10";
  const roleClass = isHero
    ? "px-3 py-1.5 text-[0.72rem] sm:text-[0.8rem]"
    : "px-2.5 py-1 text-[0.66rem]";
  const headingClass = isHero
    ? "text-4xl leading-[1.02] tracking-[-0.055em] sm:text-5xl sm:leading-[0.98] lg:text-[4.5rem] lg:leading-[0.95] xl:text-[5.5rem] xl:leading-[0.94] xl:tracking-[-0.07em]"
    : "text-4xl leading-[0.98] tracking-[-0.055em] lg:text-[3.55rem] lg:leading-[0.96] lg:tracking-[-0.065em]";
  const titleClass = isHero
    ? "mt-4 text-lg leading-8 tracking-[-0.025em] sm:text-xl lg:mt-5 lg:text-[1.45rem] xl:text-[1.7rem] xl:leading-[1.45] xl:tracking-[-0.035em]"
    : "mt-4 text-base leading-7 tracking-[-0.02em] lg:text-[1.18rem] lg:leading-[1.52] lg:tracking-[-0.028em]";
  const introClass = isHero
    ? "mt-4 text-sm leading-7 sm:text-base sm:leading-8 lg:mt-5"
    : "mt-4 text-sm leading-7";
  const actionsClass = isHero ? "mt-6 gap-3 lg:mt-8" : "mt-6 gap-2.5";
  const proofRowClass = isHero ? "mt-8 pt-6 lg:mt-12 lg:pt-8" : "mt-8 pt-6";
  const hintTextClass = isHero ? "text-sm" : "text-[0.72rem]";
  const portraitWidth = isHero
    ? "(max-width: 1023px) 72vw, (max-width: 1279px) 340px, 392px"
    : "(max-width: 767px) 68vw, 250px";
  const portraitWidthClass = isHero
    ? "w-full max-w-[18rem] justify-self-start sm:max-w-[20rem] lg:w-[340px] lg:max-w-none lg:justify-self-end xl:w-[392px]"
    : "w-full max-w-[15rem] justify-self-start md:w-[220px] md:max-w-none md:justify-self-end lg:w-[250px]";
  const portraitAnimationClass = showEntranceAnimation
    ? "folio-hero-enter-scale"
    : undefined;
  const baseEnterClass = showEntranceAnimation ? "folio-hero-enter" : undefined;
  const dividerEnterClass = showEntranceAnimation ? "folio-hero-divider-enter" : undefined;
  const showExperienceOrbit = isHero && !decorative;

  const scrollHref = "#portfolio-content";
  const projectsHref = "#projects";

  const card = (
    <div
      data-portfolio-hero-card={cardId}
      aria-hidden={decorative || undefined}
      className={cn(
        "relative z-10 w-full max-w-full overflow-hidden rounded-[2.2rem] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.88)_42%,rgba(248,246,240,0.82))] shadow-[0_22px_56px_rgba(23,35,53,0.05),inset_0_1px_0_rgba(255,255,255,0.58)] backdrop-blur-[18px]",
        !isHero && "rounded-[1.85rem] border-white/38 shadow-[0_20px_48px_rgba(23,35,53,0.08),inset_0_1px_0_rgba(255,255,255,0.52)]",
        !showExperienceOrbit && className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.08)_34%,transparent_60%),radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.42),transparent_24%),radial-gradient(circle_at_86%_16%,rgba(19,140,124,0.05),transparent_18%)]"
      />

      <div
        aria-hidden="true"
        className={cn(
          dividerEnterClass,
          "relative mx-5 mt-5 h-px bg-[linear-gradient(90deg,rgba(23,51,87,0.055),rgba(19,140,124,0.05),transparent_78%)] sm:mx-8 sm:mt-8 lg:mx-10 lg:mt-10",
          !isHero && "lg:mx-8 lg:mt-8"
        )}
        style={getEnterStyle(showEntranceAnimation, 40, 0, 0)}
      />

      <div className={cn("relative", cardPaddingClass)}>
        <div
          className={cn(
            "mx-auto grid items-center",
            contentMaxWidthClass,
            gridClass
          )}
        >
          <div className="min-w-0">
            <span
              className={cn(
                baseEnterClass,
                "inline-flex rounded-full border border-[color:rgba(19,140,124,0.14)] bg-[color:var(--folio-accent-soft)] font-medium text-[color:var(--folio-soft-strong)]",
                roleClass
              )}
              style={getEnterStyle(showEntranceAnimation, 180, 8, 3)}
            >
              {profile.role}
            </span>

            <h1
              className={cn(
                baseEnterClass,
                "mt-6 max-w-3xl text-balance font-semibold text-[color:var(--folio-ink)]",
                headingClass
              )}
              style={getEnterStyle(showEntranceAnimation, 290, 14, 7)}
            >
              {greeting}
            </h1>

            <p
              className={cn(
                baseEnterClass,
                "max-w-3xl text-pretty text-[color:var(--folio-soft-strong)]",
                titleClass
              )}
              style={getEnterStyle(showEntranceAnimation, 430, 12, 6)}
            >
              {profile.title}
            </p>

            <p
              className={cn(
                baseEnterClass,
                "max-w-2xl whitespace-pre-line text-[color:#4b596b]",
                introClass
              )}
              style={getEnterStyle(showEntranceAnimation, 560, 12, 4)}
            >
              {profile.intro}
            </p>

            <div className={cn("flex flex-wrap items-center", actionsClass)}>
              {decorative ? (
                <>
                  <span
                    className={cn(
                      baseEnterClass,
                      "folio-button pointer-events-none",
                      !isHero && "px-4 py-2 text-sm"
                    )}
                    style={getEnterStyle(showEntranceAnimation, 720, 10, 3)}
                  >
                    <span>{copy.enterLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      baseEnterClass,
                      "folio-button-secondary pointer-events-none",
                      !isHero && "px-4 py-2 text-sm"
                    )}
                    style={getEnterStyle(showEntranceAnimation, 810, 10, 3)}
                  >
                    <span>{copy.downloadCvLabel}</span>
                    <Download className="h-4 w-4" />
                  </span>
                </>
              ) : (
                <>
                  <a
                    href={projectsHref}
                    className={cn(
                      baseEnterClass,
                      "folio-button",
                      !isHero && "px-4 py-2 text-sm"
                    )}
                    style={getEnterStyle(showEntranceAnimation, 720, 10, 3)}
                  >
                    <span>{copy.enterLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  {cvDownload.href ? (
                    <a
                      href={cvDownload.href}
                      download
                      className={cn(
                        baseEnterClass,
                        "folio-button-secondary",
                        !isHero && "px-4 py-2 text-sm"
                      )}
                      style={getEnterStyle(showEntranceAnimation, 810, 10, 3)}
                    >
                      <span>{copy.downloadCvLabel}</span>
                      <Download className="h-4 w-4" />
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className={cn(
                        baseEnterClass,
                        "folio-button-secondary cursor-not-allowed opacity-60",
                        !isHero && "px-4 py-2 text-sm"
                      )}
                      style={getEnterStyle(showEntranceAnimation, 810, 10, 3)}
                      title={cvDownload.unavailableLabel}
                    >
                      <span>{copy.downloadCvLabel}</span>
                      <Download className="h-4 w-4" />
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="justify-self-end">
            <HeroPortraitCard
              alt={copy.portraitAlt}
              className={cn(
                portraitAnimationClass,
                "relative shrink-0 aspect-[0.94] overflow-hidden rounded-[1.72rem] shadow-[0_24px_52px_rgba(23,35,53,0.12),0_10px_24px_rgba(23,35,53,0.05)]",
                portraitWidthClass,
                !isHero && "rounded-[1.45rem] shadow-[0_20px_42px_rgba(23,35,53,0.1),0_8px_18px_rgba(23,35,53,0.045)]"
              )}
              priority={isHero}
              sizes={portraitWidth}
              style={getEnterStyle(showEntranceAnimation, 470, 18, 8)}
            />
          </div>
        </div>

        <div
          className={cn(
            "mx-auto flex max-w-[1128px] flex-wrap items-center justify-between gap-4 border-t border-[color:rgba(23,35,53,0.06)]",
            proofRowClass,
            !isHero && "max-w-none"
          )}
        >
          <ul className="flex flex-wrap gap-2.5">
            {profile.proofs.slice(0, 4).map((proof, index) => (
              <li
                key={proof}
                className={cn(
                  baseEnterClass,
                  "folio-proof-chip max-w-full whitespace-normal break-words bg-[color:var(--folio-preview)] text-center",
                  !isHero && "px-3 py-1.5 text-[0.72rem]"
                )}
                style={getEnterStyle(showEntranceAnimation, 930 + index * 70, 8, 2)}
              >
                {proof}
              </li>
            ))}
          </ul>

          {decorative ? (
            <span
              className={cn(
                baseEnterClass,
                "inline-flex items-center gap-2 font-medium text-[color:var(--folio-soft)]",
                hintTextClass
              )}
              style={getEnterStyle(showEntranceAnimation, 1130, 8, 2)}
            >
              <span>{copy.scrollHint}</span>
              <ArrowDown className="h-4 w-4" />
            </span>
          ) : (
            <a
              href={scrollHref}
              className={cn(
                baseEnterClass,
                "inline-flex items-center gap-2 font-medium text-[color:var(--folio-soft)] transition-colors duration-200 ease-out hover:text-[color:var(--folio-accent-2)]",
                hintTextClass
              )}
              style={getEnterStyle(showEntranceAnimation, 1130, 8, 2)}
            >
              <span>{copy.scrollHint}</span>
              <ArrowDown className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (!showExperienceOrbit) {
    return card;
  }

  return (
    <div className={cn("relative z-10 overflow-visible", className)}>
      <HeroExperienceOrbit
        mode={constellationMode}
        showEntranceAnimation={showEntranceAnimation}
      />
      {card}
    </div>
  );
}

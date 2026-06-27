import type { CSSProperties } from "react";

type HeroPortraitCardProps = {
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
};

export function HeroPortraitCard({
  alt,
  className,
  style,
}: HeroPortraitCardProps) {
  return (
    <div aria-label={alt} className={className} role="img" style={style as CSSProperties}>
      <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-[linear-gradient(180deg,rgba(244,239,231,0.38),rgba(249,247,242,0.16))]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.9),transparent_18%),linear-gradient(145deg,rgba(236,231,222,0.98),rgba(209,220,223,0.92))]"
        />
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 340"
        >
          <circle cx="160" cy="111" r="58" fill="rgba(84,98,116,0.96)" />
          <path
            d="M107 103c13-43 42-62 84-53 30 6 50 33 50 72-30-13-59-16-92-13-17 2-30 0-42-6z"
            fill="rgba(46,60,78,0.96)"
          />
          <path
            d="M118 216c19-33 47-50 82-50s63 17 82 50c21 36 26 79 23 124H15c-3-45 2-88 23-124z"
            fill="rgba(47,61,80,0.96)"
          />
          <path
            d="M70 247c15-43 45-68 90-72-27 27-41 77-41 165H25c1-34 12-69 45-93z"
            fill="rgba(92,106,123,0.48)"
          />
          <path
            d="M134 137c15 10 33 11 52 0"
            fill="none"
            stroke="rgba(239,235,228,0.54)"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="M86 238c37 31 115 32 151 0"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeLinecap="round"
            strokeWidth="9"
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%,transparent_72%,rgba(15,23,42,0.04))]"
        />
        <div
          aria-hidden="true"
          className="folio-portrait-sheen pointer-events-none absolute inset-y-[-16%] left-[-28%] w-[42%]"
        />
      </div>
    </div>
  );
}

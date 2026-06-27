import type { Metadata } from "next";

const fallbackSiteUrl = "https://your-domain.example";

function normalizeSiteUrl(value?: string) {
  if (!value) {
    return fallbackSiteUrl;
  }

  const withProtocol = value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;

  return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL
);
export const siteMetadataBase = new URL(siteUrl);

const openGraphImagePath = "/opengraph-image";

type BuildMetadataOptions = {
  description: string;
  path: string;
  siteName: string;
  title: string;
};

function absoluteUrl(path: string) {
  return new URL(path.startsWith("/") ? path : `/${path}`, siteMetadataBase);
}

export function buildMetadata({
  description,
  path,
  siteName,
  title,
}: BuildMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path).toString();
  const imageUrl = absoluteUrl(openGraphImagePath).toString();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} resume preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

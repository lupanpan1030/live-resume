import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getResumeContent } from "@/content";
import { siteMetadataBase } from "@/lib/metadata";
import "./globals.css";

const bodyFont = Geist({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getResumeContent();

  return {
    metadataBase: siteMetadataBase,
    applicationName: content.site.name,
    creator: content.site.name,
    title: {
      default: content.site.seo.title,
      template: "%s",
    },
    description: content.site.seo.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${monoFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

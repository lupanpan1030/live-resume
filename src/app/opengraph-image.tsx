import { ImageResponse } from "next/og";
import { getResumeContent } from "@/content";
import { siteUrl } from "@/lib/metadata";

export const alt = "Resume site preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const content = await getResumeContent();
  const site = content.site;
  const displayHost = new URL(siteUrl).hostname.replace(/^www\./, "");

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f6f6f1",
          color: "#172235",
          display: "flex",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(236,243,243,0.92))",
            border: "1px solid rgba(23,35,53,0.14)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: 64,
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#138c7c",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Live Resume
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                letterSpacing: -4,
                lineHeight: 0.9,
              }}
            >
              {site.name}
            </div>
            <div
              style={{
                color: "#324255",
                fontSize: 42,
                fontWeight: 600,
                lineHeight: 1.25,
                maxWidth: 820,
              }}
            >
              {site.role}
            </div>
          </div>
          <div
            style={{
              color: "#5e6a7d",
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              justifyContent: "space-between",
            }}
          >
            <span>{site.location}</span>
            <span>{displayHost}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

# Live Resume

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lupanpan1030/live-resume&env=ADMIN_PASSWORD&envDescription=Admin%20password%20for%20in-page%20editing)

A single-page Next.js resume site template with editable JSON content, an animated hero scene, Tailwind CSS, and a ready-to-deploy Vercel setup.

## What This Is

Live Resume is a clean resume website starter for a personal profile, work history, project links, education, contact links, and a downloadable CV.

It is intentionally single-language and single-page. Content lives in JSON files at the repository root, so the template can later be connected to a visual editor without changing the page structure.

## Single-Page Structure

```txt
/
  Hero
  Overview
  Skills
  Experience
  Projects
  Education
  Contact + Download CV
```

Navigation uses anchor links only:

```txt
#overview
#skills
#experience
#projects
#education
#contact
```

## Edit Content

Update the JSON files in `content/`:

| File | Controls |
| --- | --- |
| `content/site.json` | Site name, role, location, availability, SEO text, navigation, CV link, shared UI labels |
| `content/profile.json` | Hero intro, headline, proof chips, focus items, summary, overview paragraphs |
| `content/skills.json` | Skills section title, intro, groups, and skill tags |
| `content/experience.json` | Experience section title, intro, roles, summaries, highlights, and skills |
| `content/projects.json` | Project cards, metadata, descriptions, calls to action, and external links |
| `content/education.json` | Education section title, intro, schools, degrees, periods, and details |
| `content/contact.json` | Contact section title, description, and contact links |

Keep the field names stable if you plan to connect a CMS or visual editor later.

## Replace The CV

The download button points to:

```txt
public/cv/your-cv.pdf
```

Replace that file with your public CV PDF. Keep the same path, or update `content/site.json`:

```json
{
  "cv": {
    "label": "Download CV",
    "href": "/cv/your-cv.pdf"
  }
}
```

Do not commit private resume drafts, certificates, identity documents, or source files that should not be public.

## Replace Hero Assets

The desktop scene images live in:

```txt
src/assets/hero/
  keyboard.png
  monitor-frame.png
  mouse.png
  table.png
```

These files are statically imported by the hero transition component. Replace them with transparent PNG assets that keep similar proportions:

| File | Current role |
| --- | --- |
| `table.png` | Wide desk surface |
| `keyboard.png` | Keyboard on the desk |
| `monitor-frame.png` | Monitor frame around the resume preview |
| `mouse.png` | Mouse on the desk |

The person and avatar placeholders are inline neutral SVGs in the portfolio components. Replace them in code only if you want a custom illustration or real portrait.

## Local Development

Install dependencies:

```bash
npm i
```

Start the development server:

```bash
npm run dev
```

Run checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Deploy

### Vercel One-Click

Use the button at the top of this README.

1. Click **Deploy with Vercel**.
2. Connect GitHub and create the project from this repository.
3. Enter `ADMIN_PASSWORD` when Vercel prompts for environment variables.
4. Deploy once.
5. Add persistent content storage through Vercel Marketplace by installing the Upstash integration for the project. It injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
6. Redeploy after the Upstash variables are present.

Without Upstash, the site still runs with the bundled default content, but saved edits do not persist to production storage.

Set `NEXT_PUBLIC_SITE_URL` to your production URL if you want canonical URLs, sitemap, robots, and Open Graph metadata to use your domain before Vercel provides `VERCEL_URL`. Without either value, the template uses a neutral placeholder URL for metadata.

### Docker Self-Hosting

Run the app and Redis together:

```bash
ADMIN_PASSWORD="replace-this" docker compose up --build
```

The compose file sets `REDIS_URL=redis://redis:6379` for the app and stores edited content in the Redis volume. You may also set `AUTH_SECRET`:

```bash
ADMIN_PASSWORD="replace-this" AUTH_SECRET="replace-this-too" docker compose up --build
```

Production self-hosting should sit behind HTTPS, usually through a reverse proxy, because the admin session cookie is `__Host-` scoped and `secure`. Local `http://localhost:3000` is a secure browser context, so login works there for development.

### Environment Variables

| Variable | Required | Used by | Purpose |
| --- | --- | --- | --- |
| `ADMIN_PASSWORD` | Yes | Vercel, Docker | Single-admin password for `/login` and in-page editing. |
| `AUTH_SECRET` | Optional | Vercel, Docker | Explicit JWT signing secret. If omitted, the app derives a signing key from `ADMIN_PASSWORD`. |
| `UPSTASH_REDIS_REST_URL` | Required with token for persistent Vercel edits | Vercel | Upstash REST Redis URL for production content storage. |
| `UPSTASH_REDIS_REST_TOKEN` | Required with URL for persistent Vercel edits | Vercel | Upstash REST Redis token. |
| `REDIS_URL` | Set by compose | Docker | Standard TCP Redis connection string for self-hosted content storage. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Vercel, Docker | Public site URL for canonical metadata, sitemap, robots, and Open Graph links. |

Content storage selection order is Upstash REST, then standard Redis, then local file system.

### In-Page Editing

1. Visit `/login`.
2. Sign in with `ADMIN_PASSWORD`.
3. Use the owner badge in the upper-right corner to switch editing mode on.
4. Click the edit button for any section.
5. Save the inline form. The page refreshes immediately with the stored content.

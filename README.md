# Shahadat Hossain: Academic Portfolio

Personal academic website for **Shahadat Hossain**, Assistant Professor, Department of CSE, Daffodil International University.
Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript** and **Postgres**. All content is
edited in a built-in admin panel at `/admin`.

## Pages

| Route           | Content                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------- |
| `/`             | Profile hero (photo, title, research areas, key numbers), "at a glance" charts, biography, research themes, news, selected publications |
| `/research/`    | Research themes with related papers, methods, frequent co-authors                         |
| `/publications/`| Filterable/searchable list, publications-per-year chart, DOI links, APA + BibTeX "Cite"  |
| `/teaching/`    | Teaching philosophy, course materials, full teaching history by semester                  |
| `/teaching/<course>/` | Course page: its lectures in order, with short previews                             |
| `/teaching/<course>/<lecture>/` | Lecture notes (code highlighted), slides viewer, course outline, previous/next |
| `/supervision/` | Supervised theses and projects, filterable by area                                        |
| `/cv/`          | Appointments, education, awards, service, certifications, skills, PDF download          |
| `/moments/`     | Milestone timeline from the "Memorable Moments" gallery                                   |
| `/contact/`     | Email, phone, office, academic and social profiles                                        |
| `/admin/`       | Password-protected admin for everything above                                             |

Light theme by default, with a toggle for dark, responsive down to 360px, SEO metadata,
`schema.org/Person` JSON-LD, sitemap and robots.txt.

## Editing content

Sign in at **`/admin`** with the admin password. Every section of the site has a page there:

- **Teaching**: courses taught (one entry per semester), lectures (notes written with a formatting toolbar and preview,
  images, optional PDF slides), course materials, universities, teaching philosophy
- **Supervision**: theses and projects
- **Research**: publications, talks, the book, research themes, interests and methods
- **Profile**: name, title, photo, CV (PDF), contact details, biography, news, social links
- **CV**: positions, education, awards, certifications, service roles, skills
- **Moments**: photo milestones (photos are uploaded straight from the form)

Changes are live as soon as you save. Lists that have a natural order (publications by year, semesters and supervised
work by university and term, moments by year) sort themselves; the others can be reordered with the arrows.
"Save and add another" keeps fields that usually repeat, such as the university and semester when entering several projects.

Counts on the site (publications, semesters, supervised works…) are computed from the content automatically.

## Run locally

Requires Node 20+ and Docker (for the local database).

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run db:up                # Postgres on 127.0.0.1:5433
npm run dev                  # http://localhost:3000, admin at /admin
```

On first start against an empty database the site creates its tables and loads the original content from
[`src/content/seed/`](src/content/seed/). After that the database is the source of truth: editing the seed files has no effect.

The 49 lectures in `src/content/seed/lectures.json` were imported from the course pages of the old Google Site
(sites.google.com/view/shahadathossain1992), with their images and the SQA slide decks (exported to PDF) copied to
[`public/lectures/`](public/lectures/). Nothing on the site links to the Google Site any more.

## Environment variables

| Variable                | Purpose                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Postgres connection string (`POSTGRES_URL` is also accepted). Set by Vercel's Neon integration. |
| `ADMIN_PASSWORD`        | Password for `/admin` (use 12+ characters). Changing it signs everyone out.                   |
| `SESSION_SECRET`        | Random string of 32+ characters that signs admin sessions (`openssl rand -base64 32`)          |
| `NEXT_PUBLIC_SITE_URL`  | Public URL, for canonical links, the sitemap and social previews. On Vercel it defaults to the production domain; set it for a custom domain. |
| `BLOB_READ_WRITE_TOKEN` | Optional. Set by Vercel when a Blob store is connected; admin uploads then go to Blob.        |

## Deploy on the VPS (production)

The live site, **https://shahadathossain.site**, runs with Docker on a VPS:

| File                             | What it is                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `Dockerfile`                     | Builds the site as a standalone Node server                                      |
| `deploy/docker-compose.prod.yml` | The site and its own Postgres database                                           |
| `deploy/edge.caddy`              | Routing for the server's shared Caddy proxy, which handles HTTPS                 |
| `deploy/backup.sh`               | Nightly database dump (uploads live in the database, so this covers everything)  |
| `deploy/.env.example`            | Settings; copied to `deploy/.env` on the server, never committed                 |

The server runs one Caddy proxy for all its sites (`~/edge`). It reaches this site as `shahadat-web` over the
`edge-shahadat` network, which only the two of them share; the database is on the site's private network.

**First setup**, once:

```bash
git clone https://github.com/mr-shakib/shahadat-sir-portfolio.git ~/shahadat-portfolio
cd ~/shahadat-portfolio
cp deploy/.env.example deploy/.env      # then fill in the passwords
docker network create edge-shahadat
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

Then in `~/edge/docker-compose.yml`, mount `deploy/edge.caddy` as `/etc/caddy/sites/shahadat.caddy`, add
`edge-shahadat` to the proxy's networks, and run `docker compose up -d` there. The domain's A records (`@` and
`www`) must already point at the server, or the certificate can't be issued.

**Update the site** after pushing to GitHub:

```bash
cd ~/shahadat-portfolio && git pull && docker compose -f deploy/docker-compose.prod.yml up -d --build
```

Content edited in `/admin` is in the database and survives updates; the seed files are only read into an empty database.

**Backups.** Cron runs `deploy/backup.sh` at 02:30 and keeps 14 days of dumps in `/var/backups/shahadat-portfolio`.
They are on the same server, so copy them somewhere else now and then. How to restore is in the script's header.

## Deploy on Vercel (preview)

**Quick preview, no database.** Import the repository into Vercel and deploy; nothing else is needed. Without
`DATABASE_URL` the public site shows the original content from [`src/content/seed/`](src/content/seed/), read-only,
and `/admin` says it isn't set up. Add a database later to make the site editable.

**Full setup, with the admin:**

1. **Import the repository.** In Vercel, choose *Add New → Project* and import this GitHub repository. The framework
   (Next.js) and build settings are detected; leave them as they are.
2. **Add a database.** In the project, open *Storage → Create Database → Neon (Postgres)*. Pick the **Singapore**
   region (AWS ap-southeast-1) to match the site's functions, which [`vercel.json`](vercel.json) runs in Singapore
   (`sin1`), close to Bangladesh. Connect it to all environments; this sets `DATABASE_URL`.
3. **Add file storage.** *Storage → Create → Blob*, connected to the project. This sets `BLOB_READ_WRITE_TOKEN`, so
   photos and PDFs uploaded in the admin are stored in Blob (up to 50 MB each). Without it, uploads are stored in the
   database and must stay under 4 MB, Vercel's limit for a request to a function.
4. **Set the admin secrets.** *Settings → Environment Variables*: add `ADMIN_PASSWORD` and `SESSION_SECRET`
   (and `NEXT_PUBLIC_SITE_URL` if you use a custom domain).
5. **Deploy.** The first visit creates the tables and loads the original content. Then sign in at `/admin`.

Notes:

- Preview deployments use the same database unless you give them their own, so edits made on a preview are real.
- Photos are resized in the browser before upload (longest side 2400 px), which also removes location data.
- Connections use `prepare: false`, so they work through Neon's and Supabase's connection poolers.

## Other hosts

The site also runs as a plain Node server (`npm run build`, then `npm start`; it listens on `$PORT`) next to any
Postgres database, for example on Railway, Render, Fly.io or a VPS. Set the variables above. Without a Blob store,
uploaded photos and PDFs are stored in the database (table `media`, up to 10 MB each), so backing up Postgres backs up
everything. Static assets that ship with the code live in [`public/`](public/): the original portrait, CV PDF, moment
photos and lecture images.

## Code map

| Path                        | What it is                                                                     |
| --------------------------- | ------------------------------------------------------------------------------ |
| `src/content/types.ts`      | Shapes of all content                                                          |
| `src/content/schema.ts`     | Admin field definitions per section; forms, validation and lists are generated from these |
| `src/content/store.ts`      | Reading and writing content in Postgres                                        |
| `src/content/derive.ts`     | Sorting, grouping and counts computed from content                             |
| `src/content/seed/`         | The original content, loaded into an empty database                            |
| `src/lib/markdown.ts`       | Renders lecture notes (Markdown, raw HTML escaped) with code highlighting      |
| `src/lib/env.ts`            | Database URL and where uploads go (Vercel Blob or the database)                 |
| `src/app/(site)/`           | Public pages                                                                    |
| `src/app/admin/`            | Admin pages and server actions                                                  |
| `src/components/admin/`     | Admin form, list and navigation components                                      |

To add a field: add it to the type in `types.ts`, describe it in `schema.ts`, and use it in the page. The admin form
picks it up automatically.

/** Site structure. Unlike the content, this lives in code. */

/** The public address: set NEXT_PUBLIC_SITE_URL for a custom domain; on Vercel it defaults to the production URL. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const navigation = [
  { href: "/", label: "About" },
  { href: "/research/", label: "Research" },
  { href: "/publications/", label: "Publications" },
  { href: "/teaching/", label: "Teaching" },
  { href: "/supervision/", label: "Supervision" },
  { href: "/cv/", label: "CV" },
  { href: "/moments/", label: "Moments" },
  { href: "/contact/", label: "Contact" },
];

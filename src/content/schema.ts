/**
 * Admin field specs: one entry per collection. The admin forms, server-side validation and
 * list views are all generated from these, so adding a field here is all an edit form needs.
 */
import type {
  CollectionKey,
  ListCollections,
  ListKey,
  SingleKey,
  NewsKind,
  MomentCategory,
  PubType,
  SocialKey,
  ThemeIconKey,
} from "./types";
import { pubTypeLabel } from "./labels";

export type Option = { value: string; label: string };
/** Options taken from another collection: `value` is stored, `label` is shown. */
export type OptionSource = { from: ListKey; value: string; label: string };
export type Options = readonly Option[] | OptionSource;

type Base = {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Fields with a width share a row on wide screens. */
  width?: "half" | "third";
};

export type Field =
  | (Base & {
      type: "text";
      /** url: http(s) only. link: a URL or a path on this site. */
      input?: "url" | "link" | "email" | "tel";
      placeholder?: string;
      pattern?: string;
      patternHint?: string;
      /** Offer values already used in this field of a collection as suggestions. */
      suggest?: { from: ListKey; value: string };
      /** When left empty, filled with a web-address form of this sibling field, e.g. the title. */
      slugOf?: string;
    })
  | (Base & { type: "textarea"; rows?: number; placeholder?: string })
  /** Long formatted text, written in Markdown with a toolbar and preview. */
  | (Base & { type: "markdown" })
  | (Base & { type: "number"; min?: number; max?: number; placeholder?: string })
  | (Base & { type: "checkbox" })
  | (Base & { type: "select"; options: Options })
  | (Base & { type: "multiselect"; options: Options })
  /** A list of strings. `lines` edits it as one textarea, one item per line. */
  | (Base & { type: "strings"; lines?: boolean; multiline?: boolean; placeholder?: string; itemLabel?: string })
  | (Base & { type: "list"; itemLabel: string; fields: readonly Field[] })
  | (Base & { type: "group"; fields: readonly Field[] })
  | (Base & { type: "image" })
  | (Base & { type: "images" })
  | (Base & { type: "file"; accept: string });

type Common = {
  label: string;
  /** "Add <singular>" */
  singular: string;
  group: string;
  description: string;
  /** Public page that shows this content. */
  href: string;
  fields: readonly Field[];
};

export type ListSpec<K extends ListKey = ListKey> = Common & {
  kind: "list";
  key: K;
  /** manual: arranged with up/down. year: newest year first. term: newest semester first. */
  order: "manual" | "year" | "term";
  /**
   * Items belong to an item of another collection (a lecture to its course). They are grouped and
   * ordered under it, in that collection's order, and up/down moves stay within the group.
   */
  parent?: { field: string; from: ListKey; value: string; label: string };
  /** Where new items go in a manual list. */
  newAt?: "top" | "bottom";
  /** Fields whose combined value must be unique. */
  unique?: readonly string[];
  /** Fields kept when using "Save and add another", e.g. the semester when entering several projects. */
  carry?: readonly string[];
  title(item: ListCollections[K]): string;
  meta?(item: ListCollections[K]): string;
};

export type SingleSpec = Common & { kind: "single"; key: SingleKey };
export type Spec = ListSpec | SingleSpec;

const opts = <T extends string>(values: readonly T[], labels?: Partial<Record<T, string>>): Option[] =>
  values.map((v) => ({ value: v, label: labels?.[v] ?? v }));

export const socialLabels: Record<SocialKey, string> = {
  scholar: "Google Scholar",
  researchgate: "ResearchGate",
  orcid: "ORCID",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  facebook: "Facebook",
  x: "X (Twitter)",
  website: "Website",
};

const newsKinds: NewsKind[] = ["Publication", "Career", "Award", "Education", "Book", "Talk", "Event"];
const momentCategories: MomentCategory[] = ["Academic", "Research", "Teaching", "Industry", "Life"];
const themeIcons: ThemeIconKey[] = [
  "users",
  "chart",
  "brain",
  "shield",
  "book",
  "globe",
  "cpu",
  "network",
  "flask",
  "lightbulb",
];

const institutionOptions: OptionSource = { from: "institutions", value: "name", label: "name" };
const termPattern = "^(Spring|Summer|Fall|Autumn|Winter) \\d{4}$";
const monthPattern = "^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d{4}$";

const list = <K extends ListKey>(spec: Omit<ListSpec<K>, "kind">) => ({ kind: "list" as const, ...spec });
const single = (spec: Omit<SingleSpec, "kind">): SingleSpec => ({ kind: "single", ...spec });

export const specs = {
  // ── Profile ────────────────────────────────────────────────────────
  profile: single({
    key: "profile",
    label: "Profile",
    singular: "profile",
    group: "Profile",
    description: "Name, position, photo, CV, contact details and biography.",
    href: "/",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, width: "half" },
      { name: "title", label: "Academic title", type: "text", required: true, width: "half" },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "university", label: "University", type: "text", required: true, width: "half" },
      {
        name: "universityShort",
        label: "University (short)",
        type: "text",
        required: true,
        width: "half",
        help: "Shown next to your title in the site header, e.g. DIU.",
      },
      { name: "universityUrl", label: "University website", type: "text", input: "url", required: true },
      { name: "location", label: "City, country", type: "text", required: true, width: "half" },
      { name: "motto", label: "Motto", type: "text", width: "half", help: "Shown in the footer." },
      { name: "email", label: "Email", type: "text", input: "email", required: true, width: "half" },
      { name: "phones", label: "Phone numbers", type: "strings", lines: true, help: "One per line." },
      {
        name: "photo",
        label: "Portrait",
        type: "image",
        required: true,
        help: "Shown large on the home page. A tall, well-lit photo works best.",
      },
      { name: "cv", label: "CV (PDF)", type: "file", accept: "application/pdf", required: true },
      {
        name: "intro",
        label: "Home page introduction",
        type: "textarea",
        rows: 3,
        required: true,
        help: "The short paragraph under your name at the top of the home page.",
      },
      {
        name: "focusAreas",
        label: "Home page research tags",
        type: "strings",
        lines: true,
        help: "One per line. Three works best.",
      },
      {
        name: "bio",
        label: "Biography",
        type: "strings",
        multiline: true,
        itemLabel: "paragraph",
        required: true,
        help: "Each box is one paragraph.",
      },
      {
        name: "authorNames",
        label: "Your name in author lists",
        type: "strings",
        lines: true,
        required: true,
        help: "Every spelling of your name used in papers, one per line. These are underlined in author lists.",
      },
      {
        name: "office",
        label: "Office",
        type: "group",
        fields: [
          { name: "room", label: "Room", type: "text", required: true, width: "half" },
          { name: "building", label: "Building", type: "text", required: true, width: "half" },
          { name: "campus", label: "Campus", type: "text", required: true, width: "half" },
          { name: "city", label: "City", type: "text", required: true, width: "half" },
          { name: "mapUrl", label: "Map link", type: "text", input: "url", required: true },
        ],
      },
      {
        name: "photoCaption",
        label: "Photo caption",
        type: "group",
        help: "Optional. Shown over the bottom of your photo on the home page, for example a current role. Leave the main line empty to hide it.",
        fields: [
          { name: "label", label: "Small heading", type: "text", placeholder: "Currently", width: "half" },
          {
            name: "title",
            label: "Main line",
            type: "text",
            placeholder: "PhD Researcher, Jahangirnagar University",
            width: "half",
          },
          {
            name: "detail",
            label: "Second line",
            type: "text",
            placeholder: "Supervised by Prof. Dr. Mohammad Shorif Uddin",
          },
        ],
      },
    ],
  }),
  socials: list({
    key: "socials",
    label: "Social & academic profiles",
    singular: "profile link",
    group: "Profile",
    description: "Links shown as icons in the hero, footer and contact page.",
    href: "/contact/",
    order: "manual",
    fields: [
      {
        name: "key",
        label: "Icon",
        type: "select",
        options: opts(Object.keys(socialLabels) as SocialKey[], socialLabels),
        required: true,
        width: "half",
      },
      { name: "label", label: "Label", type: "text", required: true, width: "half" },
      { name: "href", label: "Link", type: "text", input: "url", required: true },
      {
        name: "handle",
        label: "Handle",
        type: "text",
        placeholder: "@username",
        help: "Optional. Shown on the contact page instead of the domain.",
      },
    ],
    title: (s) => s.label,
    meta: (s) => s.href,
  }),
  news: list({
    key: "news",
    label: "News & highlights",
    singular: "news item",
    group: "Profile",
    description: "The timeline on the home page. Newest first.",
    href: "/#news",
    order: "manual",
    newAt: "top",
    carry: ["date", "kind"],
    fields: [
      { name: "date", label: "Date", type: "text", required: true, width: "half", placeholder: "Oct 2026" },
      { name: "kind", label: "Type", type: "select", options: opts(newsKinds), required: true, width: "half" },
      { name: "text", label: "Text", type: "textarea", rows: 3, required: true },
      {
        name: "href",
        label: "Link",
        type: "text",
        input: "link",
        help: "Optional. A full URL, or a page on this site such as /publications/.",
      },
    ],
    title: (n) => n.text,
    meta: (n) => `${n.date} · ${n.kind}`,
  }),

  // ── Research ───────────────────────────────────────────────────────
  publications: list({
    key: "publications",
    label: "Publications",
    singular: "publication",
    group: "Research",
    description: "Journal articles, book chapters and conference papers. Listed by year automatically.",
    href: "/publications/",
    order: "year",
    carry: ["type", "year"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: opts(["journal", "chapter", "conference"] as PubType[], pubTypeLabel),
        required: true,
        width: "third",
      },
      { name: "year", label: "Year", type: "number", min: 1990, max: 2100, required: true, width: "third" },
      { name: "featured", label: "Feature on the home page", type: "checkbox", width: "third" },
      {
        name: "authors",
        label: "Authors",
        type: "strings",
        lines: true,
        required: true,
        help: "One per line, in the order they appear on the paper.",
      },
      { name: "venue", label: "Journal, book or conference", type: "text", required: true },
      { name: "series", label: "Volume, issue or series", type: "text", width: "half", placeholder: "Vol. 12, No. 3" },
      { name: "pages", label: "Pages", type: "text", width: "half", placeholder: "192–199" },
      {
        name: "publisher",
        label: "Publisher",
        type: "text",
        width: "half",
        suggest: { from: "publications", value: "publisher" },
      },
      { name: "location", label: "Conference location", type: "text", width: "half" },
      {
        name: "doi",
        label: "DOI",
        type: "text",
        width: "half",
        placeholder: "10.1109/COMPAS60761.2024.10796657",
        pattern: "^10\\.\\S+/\\S+$",
        patternHint: "A DOI starts with 10. and has no https://doi.org/ in front",
      },
      {
        name: "url",
        label: "Link",
        type: "text",
        input: "url",
        width: "half",
        help: "Only needed when there is no DOI.",
      },
      {
        name: "themes",
        label: "Research themes",
        type: "multiselect",
        options: { from: "themes", value: "key", label: "title" },
      },
      { name: "scopus", label: "Scopus-indexed", type: "checkbox" },
    ],
    title: (p) => p.title,
    meta: (p) => `${p.year} · ${pubTypeLabel[p.type]} · ${p.venue}`,
  }),
  talks: list({
    key: "talks",
    label: "Talks",
    singular: "talk",
    group: "Research",
    description: "Invited talks, seminars and sessions, shown on the publications page.",
    href: "/publications/",
    order: "manual",
    newAt: "top",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "event",
        label: "Event or format",
        type: "text",
        required: true,
        width: "half",
        placeholder: "Invited talk",
      },
      { name: "host", label: "Host", type: "text", width: "half" },
      { name: "date", label: "Date", type: "text", width: "half", placeholder: "June 2021" },
    ],
    title: (t) => t.title,
    meta: (t) => [t.event, t.host, t.date].filter(Boolean).join(" · "),
  }),
  book: single({
    key: "book",
    label: "Book",
    singular: "book",
    group: "Research",
    description: "The authored book featured on the home and publications pages.",
    href: "/publications/",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
      { name: "url", label: "Link", type: "text", input: "url", help: "Optional, e.g. where to buy or read it." },
    ],
  }),
  themes: list({
    key: "themes",
    label: "Research themes",
    singular: "research theme",
    group: "Research",
    description: "The main threads of your research. Publications are tagged with these.",
    href: "/research/",
    order: "manual",
    unique: ["key"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "label",
        label: "Short label",
        type: "text",
        required: true,
        width: "half",
        help: "Used on the publication filters.",
      },
      {
        name: "key",
        label: "Link id",
        type: "text",
        required: true,
        width: "half",
        pattern: "^[a-z0-9-]+$",
        patternHint: "Lowercase letters, numbers and dashes only",
        help: "Used in links such as /research/#ml. Renaming it updates tagged publications.",
      },
      { name: "icon", label: "Icon", type: "select", options: opts(themeIcons), required: true, width: "half" },
      { name: "short", label: "One-line summary", type: "text", required: true },
      { name: "summary", label: "Description", type: "textarea", rows: 5, required: true },
      { name: "questions", label: "Guiding questions", type: "strings", lines: true, help: "One per line." },
    ],
    title: (t) => t.title,
    meta: (t) => `#${t.key}`,
  }),
  research: single({
    key: "research",
    label: "Interests & methods",
    singular: "research details",
    group: "Research",
    description: "Research interests, methods and the publishers listed under “Published with”.",
    href: "/research/",
    fields: [
      {
        name: "interests",
        label: "Research interests",
        type: "strings",
        lines: true,
        help: "One per line. Shown on the home page.",
      },
      { name: "methods", label: "Methods & techniques", type: "strings", lines: true, help: "One per line." },
      {
        name: "publishers",
        label: "Published with",
        type: "strings",
        lines: true,
        help: "Publisher names shown on the home, research and publications pages.",
      },
    ],
  }),

  // ── Teaching ───────────────────────────────────────────────────────
  semesters: list({
    key: "semesters",
    label: "Courses taught",
    singular: "semester",
    group: "Teaching",
    description: "One entry per semester with the courses you taught. Sorted by university and term automatically.",
    href: "/teaching/#history",
    order: "term",
    parent: { field: "institution", from: "institutions", value: "name", label: "name" },
    unique: ["institution", "term"],
    carry: ["institution"],
    fields: [
      {
        name: "institution",
        label: "University",
        type: "select",
        options: institutionOptions,
        required: true,
        width: "half",
      },
      {
        name: "term",
        label: "Semester",
        type: "text",
        required: true,
        width: "half",
        placeholder: "Spring 2025",
        pattern: termPattern,
        patternHint: "Use a season and a year, e.g. Spring 2025",
      },
      {
        name: "courses",
        label: "Courses",
        type: "strings",
        lines: true,
        required: true,
        placeholder: "CSE221 Object Oriented Programming II\nCSE222 Object Oriented Programming II Lab",
        help: "One per line: the course code, a space, then the course title.",
      },
    ],
    title: (s) => s.term,
    meta: (s) =>
      `${s.courses.length} course${s.courses.length === 1 ? "" : "s"}: ${s.courses.map((c) => c.split(" ")[0]).join(", ")}`,
  }),
  courses: list({
    key: "courses",
    label: "Course materials",
    singular: "course",
    group: "Teaching",
    description: "Courses with published lecture notes. Each has its own page; add its lectures under Lectures.",
    href: "/teaching/#materials",
    order: "manual",
    unique: ["slug"],
    fields: [
      { name: "title", label: "Course", type: "text", required: true },
      { name: "summary", label: "One-line summary", type: "text", required: true },
      {
        name: "slug",
        label: "Web address",
        type: "text",
        slugOf: "title",
        pattern: "^[a-z0-9-]+$",
        patternHint: "Lowercase letters, numbers and dashes only",
        help: "The end of the course page’s link, e.g. algorithms in /teaching/algorithms/. Filled in from the title if left empty.",
      },
    ],
    title: (c) => c.title,
    meta: (c) => `/teaching/${c.slug}/`,
  }),
  lectures: list({
    key: "lectures",
    label: "Lectures",
    singular: "lecture",
    group: "Teaching",
    description: "Lecture notes, examples and slides, each on its own page. Grouped by course.",
    href: "/teaching/#materials",
    order: "manual",
    parent: { field: "course", from: "courses", value: "slug", label: "title" },
    unique: ["course", "slug"],
    carry: ["course"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "course",
        label: "Course",
        type: "select",
        options: { from: "courses", value: "slug", label: "title" },
        required: true,
        width: "half",
      },
      {
        name: "slug",
        label: "Web address",
        type: "text",
        width: "half",
        slugOf: "title",
        pattern: "^[a-z0-9-]+$",
        patternHint: "Lowercase letters, numbers and dashes only",
        help: "The end of the lecture’s link. Filled in from the title if left empty.",
      },
      {
        name: "body",
        label: "Notes",
        type: "markdown",
        help: "Use the toolbar for headings, lists, code and images; Preview shows the finished page. To colour code, write its language after the opening ``` of a code block, e.g. ```java.",
      },
      {
        name: "slides",
        label: "Slides (PDF)",
        type: "file",
        accept: "application/pdf",
        help: "Optional. Shown in a viewer on the lecture page, with a download link.",
      },
    ],
    title: (l) => l.title,
    meta: (l) => [l.body ? "Notes" : "No notes yet", l.slides && "Slides"].filter(Boolean).join(" · "),
  }),
  institutions: list({
    key: "institutions",
    label: "Universities",
    singular: "university",
    group: "Teaching",
    description: "Where you have taught. Courses taught and supervised work are grouped under these.",
    href: "/teaching/#history",
    order: "manual",
    unique: ["name"],
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        help: "Renaming updates its semesters and supervised work.",
      },
      { name: "short", label: "Short name", type: "text", required: true, width: "third", placeholder: "DIU" },
      { name: "period", label: "Period", type: "text", required: true, width: "third", placeholder: "2019 – 2022" },
      { name: "role", label: "Role", type: "text", required: true, width: "third" },
    ],
    title: (i) => i.name,
    meta: (i) => `${i.short} · ${i.period}`,
  }),
  philosophy: single({
    key: "philosophy",
    label: "Teaching philosophy",
    singular: "teaching philosophy",
    group: "Teaching",
    description: "The philosophy section of the teaching page.",
    href: "/teaching/",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "intro", label: "Introduction", type: "textarea", rows: 4, required: true },
      {
        name: "principles",
        label: "Principles",
        type: "list",
        itemLabel: "Principle",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "body", label: "Text", type: "textarea", rows: 3, required: true },
        ],
      },
      { name: "closing", label: "Closing statement", type: "textarea", rows: 3, required: true },
    ],
  }),

  // ── Supervision ────────────────────────────────────────────────────
  supervision: list({
    key: "supervision",
    label: "Theses & projects",
    singular: "thesis or project",
    group: "Supervision",
    description: "Supervised student work. Grouped by university and semester automatically.",
    href: "/supervision/",
    order: "term",
    parent: { field: "institution", from: "institutions", value: "name", label: "name" },
    carry: ["kind", "domain", "institution", "term"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: opts(["Project", "Thesis"]),
        required: true,
        width: "half",
      },
      {
        name: "domain",
        label: "Area",
        type: "text",
        required: true,
        width: "half",
        suggest: { from: "supervision", value: "domain" },
        help: "Pick an existing area so the page filters stay tidy.",
      },
      {
        name: "institution",
        label: "University",
        type: "select",
        options: institutionOptions,
        required: true,
        width: "half",
      },
      {
        name: "term",
        label: "Semester",
        type: "text",
        width: "half",
        placeholder: "Spring 2025",
        pattern: termPattern,
        patternHint: "Use a season and a year, e.g. Spring 2025",
        help: "Optional.",
      },
      {
        name: "outcome",
        label: "Outcome",
        type: "text",
        placeholder: "Published at ICO 2022 (Springer LNNS)",
        help: "Optional. Work with an outcome is highlighted.",
      },
    ],
    title: (s) => s.title,
    meta: (s) => [s.kind, s.domain, s.term].filter(Boolean).join(" · "),
  }),

  // ── CV ─────────────────────────────────────────────────────────────
  positions: list({
    key: "positions",
    label: "Positions",
    singular: "position",
    group: "CV",
    description: "Appointments and earlier experience, newest first.",
    href: "/cv/#appointments",
    order: "manual",
    newAt: "top",
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "org", label: "Organization", type: "text", required: true, width: "half" },
      { name: "dept", label: "Department", type: "text", width: "half" },
      {
        name: "start",
        label: "Start",
        type: "text",
        required: true,
        width: "half",
        placeholder: "Aug 2024",
        pattern: monthPattern,
        patternHint: "Use a short month and a year, e.g. Aug 2024",
      },
      {
        name: "end",
        label: "End",
        type: "text",
        required: true,
        width: "half",
        placeholder: "Present",
        pattern: `${monthPattern}|^Present$`,
        patternHint: "Use a short month and a year, e.g. Jul 2024, or Present",
      },
      { name: "current", label: "Current position", type: "checkbox", width: "half" },
      {
        name: "academic",
        label: "Academic appointment",
        type: "checkbox",
        width: "half",
        help: "Academic roles appear on the timeline, others under Earlier experience.",
      },
    ],
    title: (p) => p.role,
    meta: (p) => `${p.org} · ${p.start} – ${p.end}`,
  }),
  education: list({
    key: "education",
    label: "Education",
    singular: "degree",
    group: "CV",
    description: "Degrees, highest first. The first three appear on the home page.",
    href: "/cv/#education",
    order: "manual",
    newAt: "top",
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "field", label: "Field", type: "text", width: "half" },
      { name: "year", label: "Year", type: "text", required: true, width: "half", placeholder: "2020 or Ongoing" },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "thesis", label: "Thesis", type: "text" },
      { name: "supervisor", label: "Supervisor", type: "text" },
      { name: "result", label: "Result", type: "text", width: "half", placeholder: "CGPA 3.83 / 4.00" },
      { name: "honor", label: "Honor", type: "text", width: "half" },
    ],
    title: (e) => e.degree,
    meta: (e) => `${e.institution} · ${e.year}`,
  }),
  awards: list({
    key: "awards",
    label: "Awards & honors",
    singular: "award",
    group: "CV",
    description: "Awards, honors and scholarships.",
    href: "/cv/#awards",
    order: "manual",
    newAt: "top",
    fields: [
      { name: "title", label: "Award", type: "text", required: true },
      { name: "by", label: "Awarded by", type: "text", required: true, width: "half" },
      { name: "year", label: "Year", type: "text", width: "half" },
      { name: "detail", label: "Details", type: "textarea", rows: 2 },
    ],
    title: (a) => a.title,
    meta: (a) => [a.by, a.year].filter(Boolean).join(" · "),
  }),
  certifications: list({
    key: "certifications",
    label: "Certifications",
    singular: "certification",
    group: "CV",
    description: "Certificates and diplomas.",
    href: "/cv/#certifications",
    order: "manual",
    newAt: "top",
    fields: [
      { name: "title", label: "Certification", type: "text", required: true },
      { name: "by", label: "Issued by", type: "text", required: true, width: "half" },
      { name: "year", label: "Year", type: "text", width: "half" },
    ],
    title: (c) => c.title,
    meta: (c) => [c.by, c.year].filter(Boolean).join(" · "),
  }),
  service: list({
    key: "service",
    label: "Service roles",
    singular: "service role",
    group: "CV",
    description: "Committee memberships and departmental roles.",
    href: "/cv/#service",
    order: "manual",
    fields: [
      { name: "role", label: "Role", type: "text", required: true, width: "half", placeholder: "Member" },
      { name: "body", label: "Committee or body", type: "text", required: true, width: "half" },
    ],
    title: (s) => s.body,
    meta: (s) => s.role,
  }),
  skills: list({
    key: "skills",
    label: "Skills",
    singular: "skill group",
    group: "CV",
    description: "Skills grouped by area.",
    href: "/cv/#skills",
    order: "manual",
    fields: [
      { name: "group", label: "Area", type: "text", required: true },
      { name: "items", label: "Skills", type: "strings", lines: true, required: true, help: "One per line." },
    ],
    title: (s) => s.group,
    meta: (s) => s.items.join(", "),
  }),
  cvLists: single({
    key: "cvLists",
    label: "Review, development & interests",
    singular: "CV lists",
    group: "CV",
    description: "Peer review, professional development and personal interests.",
    href: "/cv/#service",
    fields: [
      {
        name: "reviewing",
        label: "Peer review",
        type: "strings",
        lines: true,
        help: "Conferences and journals you have reviewed for, one per line.",
      },
      { name: "development", label: "Professional development", type: "strings", lines: true, help: "One per line." },
      { name: "interests", label: "Personal interests", type: "strings", lines: true, help: "One per line." },
    ],
  }),

  // ── Moments ────────────────────────────────────────────────────────
  moments: list({
    key: "moments",
    label: "Moments",
    singular: "moment",
    group: "Moments",
    description: "Photo milestones, grouped by year automatically.",
    href: "/moments/",
    order: "year",
    carry: ["year", "category"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "year", label: "Year", type: "number", min: 1990, max: 2100, required: true, width: "half" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: opts(momentCategories),
        required: true,
        width: "half",
      },
      { name: "caption", label: "Caption", type: "textarea", rows: 3, required: true },
      { name: "images", label: "Photos", type: "images", help: "The first photo leads the card. JPEG, PNG or WebP." },
    ],
    title: (m) => m.title,
    meta: (m) => `${m.year} · ${m.category} · ${m.images.length} photo${m.images.length === 1 ? "" : "s"}`,
  }),
} satisfies { [K in CollectionKey]: K extends ListKey ? ListSpec<K> : SingleSpec };

/** Sidebar order. */
export const groups: { label: string; keys: CollectionKey[] }[] = [
  { label: "Teaching", keys: ["semesters", "lectures", "courses", "institutions", "philosophy"] },
  { label: "Supervision", keys: ["supervision"] },
  { label: "Research", keys: ["publications", "talks", "book", "themes", "research"] },
  { label: "Profile", keys: ["profile", "news", "socials"] },
  { label: "CV", keys: ["positions", "education", "awards", "certifications", "service", "skills", "cvLists"] },
  { label: "Moments", keys: ["moments"] },
];

export function getSpec(key: string): Spec | undefined {
  return Object.hasOwn(specs, key) ? (specs[key as CollectionKey] as Spec) : undefined;
}

export const sourceKey = (s: { from: string; value: string }) => `${s.from}.${s.value}`;

/**
 * Option lists for every field that draws its options (or suggestions) from another collection,
 * keyed by `sourceKey`. `items` returns a collection's current items.
 */
export function sourceOptions(items: (key: ListKey) => readonly object[]) {
  const out: Record<string, Option[]> = {};
  for (const spec of Object.values(specs) as Spec[]) {
    for (const f of spec.fields) {
      const src =
        (f.type === "select" || f.type === "multiselect") && !Array.isArray(f.options)
          ? (f.options as OptionSource)
          : f.type === "text" && f.suggest
            ? { ...f.suggest, label: f.suggest.value }
            : null;
      if (!src || out[sourceKey(src)]) continue;
      const seen = new Map<string, string>();
      for (const item of items(src.from) as Record<string, unknown>[]) {
        const value = item[src.value];
        if (typeof value === "string" && value && !seen.has(value)) seen.set(value, String(item[src.label] ?? value));
      }
      const options = [...seen].map(([value, label]) => ({ value, label }));
      out[sourceKey(src)] = f.type === "text" ? options.sort((a, b) => a.label.localeCompare(b.label)) : options;
    }
  }
  return out;
}

/** Every collection field that other collections point at, e.g. institutions.name. */
export function referencesTo(collection: ListKey) {
  const refs: { collection: ListKey; field: string; value: string; multiple: boolean }[] = [];
  for (const spec of Object.values(specs) as Spec[]) {
    if (spec.kind !== "list") continue;
    for (const f of spec.fields) {
      if ((f.type === "select" || f.type === "multiselect") && !Array.isArray(f.options)) {
        const src = f.options as OptionSource;
        if (src.from === collection)
          refs.push({ collection: spec.key, field: f.name, value: src.value, multiple: f.type === "multiselect" });
      }
    }
  }
  return refs;
}

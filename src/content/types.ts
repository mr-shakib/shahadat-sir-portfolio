/** Shapes of every piece of site content. The admin field specs in ./schema.ts mirror these. */

export type Profile = {
  name: string;
  title: string;
  department: string;
  university: string;
  universityShort: string;
  universityUrl: string;
  location: string;
  photo: string;
  cv: string;
  motto: string;
  email: string;
  phones: string[];
  office: { room: string; building: string; campus: string; city: string; mapUrl: string };
  intro: string;
  focusAreas: string[];
  bio: string[];
  authorNames: string[];
  /** Optional caption over the home page photo. Hidden while `title` is empty. */
  photoCaption?: { label?: string; title?: string; detail?: string };
};

export type SocialKey =
  "scholar" | "researchgate" | "orcid" | "linkedin" | "github" | "youtube" | "facebook" | "x" | "website";
export type Social = { key: SocialKey; label: string; href: string; handle?: string };

export type NewsKind = "Publication" | "Career" | "Award" | "Education" | "Book" | "Talk" | "Event";
export type NewsItem = { date: string; kind: NewsKind; text: string; href?: string };

export type ThemeIconKey =
  "users" | "chart" | "brain" | "shield" | "book" | "globe" | "cpu" | "network" | "flask" | "lightbulb";
export type ResearchTheme = {
  key: string;
  label: string;
  title: string;
  icon: ThemeIconKey;
  short: string;
  summary: string;
  questions: string[];
};
export type ResearchLists = { interests: string[]; methods: string[]; publishers: string[] };

export type PubType = "journal" | "chapter" | "conference";
export type Publication = {
  type: PubType;
  title: string;
  authors: string[];
  venue: string;
  series?: string;
  pages?: string;
  publisher?: string;
  year: number;
  doi?: string;
  url?: string;
  location?: string;
  scopus?: boolean;
  themes: string[];
  featured?: boolean;
};
export type Talk = { title: string; event: string; host?: string; date?: string };
export type Book = { title: string; description: string; url?: string };

export type Philosophy = {
  title: string;
  intro: string;
  principles: { title: string; body: string }[];
  closing: string;
};
export type Institution = { name: string; short: string; role: string; period: string };
export type Semester = { institution: string; term: string; courses: string[] };
export type CourseMaterial = { title: string; slug: string; summary: string };
export type Lecture = { course: string; title: string; slug: string; body?: string; slides?: string };

export type SupervisionKind = "Thesis" | "Project";
export type SupervisedWork = {
  title: string;
  kind: SupervisionKind;
  domain: string;
  institution: string;
  term?: string;
  outcome?: string;
};

export type Position = {
  role: string;
  org: string;
  dept?: string;
  start: string;
  end: string;
  current?: boolean;
  academic?: boolean;
};
export type Degree = {
  degree: string;
  field?: string;
  institution: string;
  year: string;
  thesis?: string;
  supervisor?: string;
  result?: string;
  honor?: string;
};
export type Award = { title: string; by: string; detail?: string; year?: string };
export type Certification = { title: string; by: string; year?: string };
export type ServiceRole = { role: string; body: string };
export type SkillGroup = { group: string; items: string[] };
export type CvLists = { reviewing: string[]; development: string[]; interests: string[] };

export type MomentCategory = "Academic" | "Research" | "Teaching" | "Industry" | "Life";
export type Moment = { year: number; title: string; caption: string; category: MomentCategory; images: string[] };

/** Collections that hold a list of items. */
export type ListCollections = {
  socials: Social;
  news: NewsItem;
  themes: ResearchTheme;
  publications: Publication;
  talks: Talk;
  institutions: Institution;
  semesters: Semester;
  courses: CourseMaterial;
  lectures: Lecture;
  supervision: SupervisedWork;
  positions: Position;
  education: Degree;
  awards: Award;
  certifications: Certification;
  service: ServiceRole;
  skills: SkillGroup;
  moments: Moment;
};

/** Collections that hold exactly one record. */
export type SingleCollections = {
  profile: Profile;
  research: ResearchLists;
  book: Book;
  philosophy: Philosophy;
  cvLists: CvLists;
};

export type ListKey = keyof ListCollections;
export type SingleKey = keyof SingleCollections;
export type CollectionKey = ListKey | SingleKey;

export type WithId<T> = T & { id: string };

export type Content = { [K in ListKey]: WithId<ListCollections[K]>[] } & SingleCollections & {
    /** When any content was last changed. */
    updatedAt: Date;
  };

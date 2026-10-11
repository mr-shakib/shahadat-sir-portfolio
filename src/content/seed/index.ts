/**
 * The site's original content. It is copied into the database the first time the site starts
 * against an empty database; after that, all edits happen in /admin and these files are not read.
 */
import type { Lecture, ListCollections, ListKey, SingleCollections } from "../types";
import { awards, certifications, cvLists, education, positions, service, skills } from "./cv";
import { moments } from "./moments";
import { news } from "./news";
import { profile, socials } from "./profile";
import { book, publications, talks } from "./publications";
import { research, themes } from "./research";
import { supervision } from "./supervision";
import { courses, institutions, philosophy, semesters } from "./teaching";
// Lecture notes imported from the course pages of the old Google Site; images and slides are in public/lectures/.
import lectures from "./lectures.json";

export const seed: { [K in ListKey]: ListCollections[K][] } & SingleCollections = {
  profile,
  socials,
  news,
  themes,
  research,
  publications,
  talks,
  book,
  philosophy,
  institutions,
  semesters,
  courses,
  lectures: lectures as Lecture[],
  supervision,
  positions,
  education,
  awards,
  certifications,
  service,
  skills,
  cvLists,
  moments,
};

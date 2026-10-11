import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuArrowRight, LuChevronDown, LuDownload, LuMaximize2 } from "react-icons/lu";
import { courseLectures, excerpt } from "@/content/derive";
import { getContent } from "@/content/store";
import type { CourseMaterial, Lecture, WithId } from "@/content/types";
import { renderMarkdown, type Heading } from "@/lib/markdown";

type Props = { params: Promise<{ course: string; lecture: string }> };

async function load(params: Props["params"]) {
  const { course: courseSlug, lecture: lectureSlug } = await params;
  const content = await getContent();
  const course = content.courses.find((c) => c.slug === courseSlug);
  const lectures = course ? courseLectures(content.lectures, course.slug) : [];
  const index = lectures.findIndex((l) => l.slug === lectureSlug);
  return { course, lectures, index, lecture: lectures[index] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, lecture, index } = await load(params);
  if (!course || !lecture) return {};
  return {
    title: `${lecture.title} · ${course.title}`,
    description: excerpt(lecture.body) || `Lecture ${index + 1} of ${course.title}.`,
  };
}

export default async function LecturePage({ params }: Props) {
  const { course, lectures, index, lecture } = await load(params);
  if (!course || !lecture) notFound();
  const { html, headings } = renderMarkdown(lecture.body);
  const prev = lectures[index - 1];
  const next = lectures[index + 1];
  const href = (l: Lecture) => `/teaching/${course.slug}/${l.slug}/`;

  return (
    <>
      <header className="border-b border-line">
        <div className="container-page pt-10 pb-10 sm:pt-14 sm:pb-12">
          <nav aria-label="Breadcrumb" className="border-t border-fg/80 pt-3">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-fg">
              <li>
                <Link href="/teaching/#materials" className="hover:text-primary">
                  Teaching
                </Link>
              </li>
              <li aria-hidden className="text-muted">
                /
              </li>
              <li>
                <Link href={`/teaching/${course.slug}/`} className="hover:text-primary">
                  {course.title}
                </Link>
              </li>
            </ol>
          </nav>
          <p className="mt-10 text-[13px] font-semibold text-primary sm:mt-12">
            Lecture {index + 1} of {lectures.length}
          </p>
          <h1 className="mt-2 max-w-3xl font-serif text-[2.4rem] leading-[1.05] font-medium tracking-[-0.02em] text-fg sm:text-[3.25rem]">
            {lecture.title}
          </h1>
        </div>
      </header>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 lg:py-14">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto">
          <details className="group rounded-xl border border-line bg-surface lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
              All lectures in this course
              <LuChevronDown className="size-4 text-muted transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="border-t border-line px-2 py-3">
              <LectureList course={course} lectures={lectures} current={lecture.id} headings={[]} />
            </div>
          </details>
          <nav aria-label={`${course.title} lectures`} className="hidden lg:block">
            <Link
              href={`/teaching/${course.slug}/`}
              className="block px-3 font-serif text-lg leading-snug font-medium text-fg hover:text-primary"
            >
              {course.title}
            </Link>
            <div className="mt-3 border-l border-line">
              <LectureList course={course} lectures={lectures} current={lecture.id} headings={headings} />
            </div>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          {lecture.slides && <Slides src={lecture.slides} title={lecture.title} />}
          {html.trim() ? (
            <div className="prose-lecture" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            !lecture.slides && <p className="text-fg-2">Notes for this lecture are coming soon.</p>
          )}

          <nav aria-label="More lectures" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            {prev && (
              <Link
                href={href(prev)}
                className="group card p-5 transition hover:border-primary/30 hover:shadow-card-lg"
              >
                <span className="flex items-center gap-1.5 text-[13px] text-muted">
                  <LuArrowLeft className="size-4 transition group-hover:-translate-x-0.5" aria-hidden /> Previous
                </span>
                <span className="mt-1 block font-medium text-fg group-hover:text-primary">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={href(next)}
                className="group card p-5 text-right transition hover:border-primary/30 hover:shadow-card-lg sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-1.5 text-[13px] text-muted">
                  Next <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="mt-1 block font-medium text-fg group-hover:text-primary">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </>
  );
}

function LectureList({
  course,
  lectures,
  current,
  headings,
}: {
  course: CourseMaterial;
  lectures: WithId<Lecture>[];
  current: string;
  headings: Heading[];
}) {
  // The outline lists the lecture's top-level sections, whichever heading level they use.
  const top = Math.min(...headings.map((h) => h.level));
  const outline = headings.filter((h) => h.level === top);
  return (
    <ol className="space-y-0.5">
      {lectures.map((l, i) => {
        const active = l.id === current;
        return (
          <li key={l.id}>
            <Link
              href={`/teaching/${course.slug}/${l.slug}/`}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`-ml-px flex gap-2.5 border-l-2 px-3 py-1.5 text-[14px] leading-snug transition ${
                active
                  ? "border-gold-bright font-semibold text-fg"
                  : "border-transparent text-fg-2 hover:border-line-strong hover:text-fg"
              }`}
            >
              <span className="w-5 shrink-0 font-mono text-[11.5px] leading-[1.6rem] text-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{l.title}</span>
            </Link>
            {active && outline.length > 1 && (
              <ul className="mt-1 mb-2 ml-10 space-y-1 border-l border-line pl-3" aria-label="On this page">
                {outline.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="block text-[13px] leading-snug text-muted hover:text-primary">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Slides({ src, title }: { src: string; title: string }) {
  return (
    <figure className="mb-12">
      <div className="overflow-hidden rounded-xl border border-line bg-surface-2 shadow-card">
        <object
          data={`${src}#view=FitH`}
          type="application/pdf"
          aria-label={`Slides: ${title}`}
          className="block aspect-[4/3] w-full"
        >
          <p className="p-6 text-sm text-fg-2">
            The slides can’t be shown here.{" "}
            <a href={src} className="link">
              Open the PDF
            </a>
            .
          </p>
        </object>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">Lecture slides (PDF)</span>
        <span className="flex gap-2">
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-secondary py-1.5">
            <LuMaximize2 className="size-4" aria-hidden /> Open full screen
          </a>
          <a href={src} download className="btn btn-secondary py-1.5">
            <LuDownload className="size-4" aria-hidden /> Download
          </a>
        </span>
      </figcaption>
    </figure>
  );
}

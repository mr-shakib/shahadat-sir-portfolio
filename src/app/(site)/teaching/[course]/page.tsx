import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuArrowRight, LuPresentation } from "react-icons/lu";
import { PageHeader } from "@/components/PageHeader";
import { courseLectures, excerpt } from "@/content/derive";
import { getContent } from "@/content/store";

type Props = { params: Promise<{ course: string }> };

async function load(slug: string) {
  const content = await getContent();
  const course = content.courses.find((c) => c.slug === slug);
  return { content, course, lectures: course ? courseLectures(content.lectures, course.slug) : [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { content, course } = await load((await params).course);
  if (!course) return {};
  return { title: course.title, description: `${course.summary} Lecture notes by ${content.profile.name}.` };
}

export default async function CoursePage({ params }: Props) {
  const { course, lectures } = await load((await params).course);
  if (!course) notFound();
  const withSlides = lectures.filter((l) => l.slides).length;

  return (
    <>
      <PageHeader
        breadcrumb={[
          { href: "/teaching/", label: "Teaching" },
          { href: "/teaching/#materials", label: "Course materials" },
        ]}
        title={course.title}
        description={course.summary}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {lectures[0] && (
            <Link
              href={`/teaching/${course.slug}/${lectures[0].slug}/`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-card transition hover:bg-primary-hover"
            >
              Start with lecture 1 <LuArrowRight className="size-4" aria-hidden />
            </Link>
          )}
          <p className="text-sm text-muted">
            {lectures.length} lecture{lectures.length === 1 ? "" : "s"}
            {withSlides > 0 && ` · ${withSlides} with slides`}
          </p>
        </div>
      </PageHeader>

      <section className="container-page py-14" aria-label="Lectures">
        {lectures.length === 0 ? (
          <p className="text-fg-2">Lectures for this course are coming soon.</p>
        ) : (
          <ol className="divide-y divide-line border-y border-line">
            {lectures.map((l, i) => {
              const summary = excerpt(l.body);
              return (
                <li key={l.id}>
                  <Link
                    href={`/teaching/${course.slug}/${l.slug}/`}
                    prefetch={false}
                    className="group grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-x-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_auto]"
                  >
                    <span className="font-serif text-xl text-muted tabular-nums sm:text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-xl leading-snug font-medium text-fg transition group-hover:text-primary">
                        {l.title}
                      </span>
                      {summary && (
                        <span className="mt-1.5 line-clamp-2 block text-[14.5px] leading-relaxed text-fg-2">
                          {summary}
                        </span>
                      )}
                    </span>
                    <span className="col-start-2 mt-2 flex items-center gap-3 sm:col-start-3 sm:mt-0">
                      {l.slides && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-primary">
                          <LuPresentation className="size-3.5" aria-hidden /> Slides
                        </span>
                      )}
                      <LuArrowRight
                        className="hidden size-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary sm:block"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        <Link
          href="/teaching/#materials"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <LuArrowLeft className="size-4" aria-hidden /> All course materials
        </Link>
      </section>
    </>
  );
}

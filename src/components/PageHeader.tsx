import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  /** Where a sub-page sits, e.g. Teaching / Course materials. Top-level pages leave it out. */
  breadcrumb?: { href: string; label: string }[];
  children?: ReactNode;
};

export function PageHeader({ title, description, breadcrumb, children }: Props) {
  return (
    <section className="border-b border-line">
      <div className="container-page pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="border-t border-fg/80 pt-3">
          {breadcrumb && (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-fg">
                {breadcrumb.map((b, i) => (
                  <li key={b.href} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden className="text-muted">
                        /
                      </span>
                    )}
                    <Link href={b.href} className="hover:text-primary">
                      {b.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
        <h1
          className={`${breadcrumb ? "mt-10 sm:mt-12" : "mt-7 sm:mt-9"} max-w-3xl font-serif text-[2.6rem] leading-[1.05] font-medium tracking-[-0.02em] text-fg sm:text-[3.4rem] lg:text-[3.75rem]`}
        >
          {title}
        </h1>
        {description && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-2">{description}</div>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}

export function StatRow({ stats }: { stats: { value: string | number; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-y-6 border-t border-line pt-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
      {stats.map((s) => (
        <div key={s.label} className="pr-4 sm:px-6 sm:first:pl-0">
          <dt className="text-[13px] text-muted">{s.label}</dt>
          <dd className="mt-1 text-[2.25rem] leading-none font-semibold tracking-tight text-fg">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowUpRight, LuChevronRight } from "react-icons/lu";

type Props = {
  crumbs?: { href: string; label: string }[];
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminHeader({ crumbs = [], title, description, actions }: Props) {
  return (
    <header className="mb-8">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted">
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <Link href={c.href} className="hover:text-fg">
                  {c.label}
                </Link>
                <LuChevronRight className="size-3.5" aria-hidden />
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-fg sm:text-[2.25rem]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-fg-2">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function Notice({ tone = "success", children }: { tone?: "success" | "danger"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm ${
        tone === "success" ? "border-success/30 bg-success-soft text-fg" : "border-danger/30 bg-danger-soft text-fg"
      }`}
    >
      {children}
    </div>
  );
}

export function ViewOnSite({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
      View on site <LuArrowUpRight className="size-4" aria-hidden />
    </a>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowRight } from "react-icons/lu";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  id?: string;
};

export function SectionHeading({ title, description, action, id }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2
          id={id}
          className="font-serif text-[1.9rem] leading-tight font-medium tracking-[-0.01em] text-fg sm:text-[2.2rem]"
        >
          {title}
        </h2>
        {description && <p className="mt-3 leading-relaxed text-fg-2">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary"
        >
          {action.label}
          <LuArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

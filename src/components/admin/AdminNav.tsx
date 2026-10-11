"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowUpRight, LuLayoutGrid, LuLogOut, LuMenu, LuX } from "react-icons/lu";
import { logout } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { groups, specs } from "@/content/schema";

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const link = (href: string, active: boolean) =>
    `flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[14px] transition ${
      active ? "bg-primary-soft font-semibold text-primary" : "text-fg-2 hover:bg-surface-2 hover:text-fg"
    }`;

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <Link href="/admin/" className="font-serif text-lg font-semibold">
          Site admin
        </Link>
        <button
          type="button"
          className="btn-icon"
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <LuX className="size-5" aria-hidden /> : <LuMenu className="size-5" aria-hidden />}
        </button>
      </div>

      <aside
        id="admin-nav"
        className={`${open ? "block" : "hidden"} border-b border-line bg-surface lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto lg:border-r lg:border-b-0`}
      >
        <div className="flex min-h-full flex-col px-3 py-5">
          <div className="hidden px-2.5 pb-5 lg:block">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Site admin</p>
            <p className="mt-1 font-serif text-lg leading-tight font-semibold text-fg">{name}</p>
          </div>

          <nav aria-label="Admin" className="space-y-5">
            <Link href="/admin/" className={link("/admin/", pathname === "/admin/" || pathname === "/admin")}>
              <LuLayoutGrid className="size-4" aria-hidden /> Overview
            </Link>
            {groups.map((g) => (
              <div key={g.label}>
                <p className="px-2.5 text-[11.5px] font-semibold tracking-[0.12em] text-muted uppercase">{g.label}</p>
                <ul className="mt-1.5 space-y-0.5">
                  {g.keys.map((key) => {
                    const href = `/admin/${key}/`;
                    return (
                      <li key={key}>
                        <Link
                          href={href}
                          aria-current={pathname.startsWith(href) ? "page" : undefined}
                          className={link(href, pathname.startsWith(href))}
                        >
                          {specs[key].label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-8 space-y-1 border-t border-line pt-4 lg:mt-auto">
            <a href="/" target="_blank" rel="noopener noreferrer" className={link("/", false)}>
              <LuArrowUpRight className="size-4" aria-hidden /> View site
            </a>
            <form action={logout}>
              <button type="submit" className={`${link("", false)} w-full`}>
                <LuLogOut className="size-4" aria-hidden /> Sign out
              </button>
            </form>
            <div className="flex items-center justify-between px-2.5 pt-2">
              <span className="text-[13px] text-muted">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

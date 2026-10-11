"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuDownload, LuMenu, LuX } from "react-icons/lu";
import { navigation } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

type Props = { name: string; title: string; org: string; cv: string };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function Header({ name, title, org, cv }: Props) {
  const pathname = norm(usePathname() ?? "/");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/85 shadow-[0_1px_0_rgb(0_0_0/0.02)] backdrop-blur-xl"
          : "border-b border-transparent bg-bg/0"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${name}, home`}>
          <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-ink font-serif text-[15px] font-semibold tracking-tight text-on-ink dark:bg-primary dark:text-on-primary">
            {initials(name)}
            <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-bg bg-gold-bright" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-[17px] font-semibold tracking-tight text-fg">{name}</span>
            <span className="block text-[11.5px] text-muted">
              {title}
              {org && ` · ${org}`}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors ${
                isActive(item.href) ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3 -bottom-[3px] h-[2px] rounded-full bg-gold-bright" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={cv}
            className="hidden items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[13px] font-semibold text-on-primary transition hover:bg-primary-hover sm:inline-flex"
          >
            <LuDownload className="size-3.5" aria-hidden />
            CV
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <LuX className="size-4" aria-hidden /> : <LuMenu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg lg:hidden"
        >
          <ul className="container-page flex flex-col py-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-line py-4 font-serif text-2xl ${
                    isActive(item.href) ? "text-primary" : "text-fg"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && <span className="size-2 rounded-full bg-gold-bright" aria-hidden />}
                </Link>
              </li>
            ))}
            <li className="pt-6">
              <a
                href={cv}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
              >
                <LuDownload className="size-4" aria-hidden /> Download CV (PDF)
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

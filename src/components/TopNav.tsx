"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { siteConfig } from "@/config/site";

const navLinks = [
  { label: "Official Levels", href: "/levels" },
  { label: "Community Levels", href: "/community" },
  { label: "Level Builder", href: "/level-builder" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">
          MINI SUDOKU
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "transition hover:text-slate-900",
                pathname === link.href && "text-slate-900",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href={siteConfig.communityDiscussionUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-900 transition hover:bg-slate-900 hover:text-white"
        >
          Submit Level
        </a>
      </div>
    </header>
  );
}


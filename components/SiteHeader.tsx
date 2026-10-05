"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Dialog from "./Dialog";
import ReadingSettings from "./ReadingSettings";
import { BrandMark } from "./illustrations/Drawings";

const navItems = [
  { href: "/", key: "home" },
  { href: "/courses", key: "courses" },
  { href: "/my-learning", key: "myLearning" },
  { href: "/help", key: "help" },
] as const;

export default function SiteHeader() {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const tl = useTranslations("language");
  const tr = useTranslations("reading");
  const pathname = usePathname();
  const locale = useLocale();
  const [readingOpen, setReadingOpen] = useState(false);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="no-print border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-4">
        <Link href="/" className="flex min-h-[2.8rem] items-center gap-3 no-underline">
          <BrandMark className="h-12 w-12" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-2xl text-ink">{tb("name")}</span>
            <span className="text-small text-ink-soft">{tb("by")}</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label={tl("label")} className="flex items-center rounded-md border-2 border-ink bg-white">
            {routing.locales.map((l, i) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                lang={l}
                aria-current={l === locale ? "true" : undefined}
                className={`flex min-h-[2.6rem] items-center px-4 text-lg ${
                  i > 0 ? "border-l-2 border-ink" : ""
                } ${l === locale ? "bg-ink font-bold text-white" : "text-ink underline underline-offset-4 hover:bg-paper-deep"}`}
              >
                {tl(l)}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setReadingOpen(true)}
            className="inline-flex min-h-[2.8rem] items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep"
          >
            <span aria-hidden="true" className="font-heading text-xl">
              Aa
            </span>
            {tr("button")}
          </button>
        </div>
      </div>

      <nav aria-label={t("label")} className="mx-auto max-w-page px-5">
        <ul className="flex flex-wrap gap-x-2">
          {navItems.map((item) => {
            const current = isCurrent(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`flex min-h-[2.8rem] items-center border-b-[5px] px-3 pt-1 text-lg ${
                    current
                      ? "border-marigold font-bold text-ink"
                      : "border-transparent text-green underline underline-offset-4 hover:border-line-soft"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Dialog open={readingOpen} onClose={() => setReadingOpen(false)} title={tr("title")}>
        <ReadingSettings />
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => setReadingOpen(false)}
            className="inline-flex min-h-[2.8rem] items-center rounded-md border-2 border-green bg-green px-6 text-lg font-bold text-white hover:bg-green-dark"
          >
            {tr("done")}
          </button>
          <Link
            href="/settings"
            onClick={() => setReadingOpen(false)}
            className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold"
          >
            {tr("moreSettings")}
          </Link>
        </div>
      </Dialog>
    </header>
  );
}

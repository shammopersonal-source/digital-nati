import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Icon from "./Icon";

type Href = ComponentProps<typeof Link>["href"];
type Crumb = { label: string; href?: Href };

/**
 * The top of every inner page: a big "← Back" button and a plain-words
 * breadcrumb, so learners always know where they are and how to go back.
 */
export default function PageTop({ back, crumbs }: { back: Href; crumbs: Crumb[] }) {
  const t = useTranslations("common");
  const all: Crumb[] = [{ label: t("home"), href: "/" }, ...crumbs];

  return (
    <div className="no-print mx-auto flex max-w-page flex-col gap-3 px-5 pt-6 sm:flex-row sm:items-center sm:gap-6">
      <Link
        href={back}
        className="inline-flex min-h-[2.8rem] w-fit items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep"
      >
        <Icon name="arrowLeft" />
        {t("back")}
      </Link>
      <nav aria-label={t("breadcrumb")}>
        <ol className="flex flex-wrap items-center gap-x-2 text-lg">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {c.href && !last ? (
                  <Link href={c.href} className="text-link inline-flex min-h-[2.8rem] items-center">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className="inline-flex min-h-[2.8rem] items-center font-bold">
                    {c.label}
                  </span>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-ink-soft">
                    ›
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

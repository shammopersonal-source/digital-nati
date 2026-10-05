"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { chapters, isReady, pick } from "@/content/path";
import { useAppData, useHydrated } from "@/lib/storage";
import Icon from "../Icon";
import { TextLink } from "../Button";
import { Nati } from "../illustrations/Drawings";
import GoalSummary, { GoalChooser } from "./GoalSummary";

// The winding path: each lesson sits a little to the left or right of the one
// before, like stepping stones. Offsets repeat in this pattern.
const OFFSETS = ["0rem", "3rem", "5rem", "3rem", "0rem", "-2rem"];

/** The next lesson to do: the first ready one that isn't finished. */
export function useNextLesson() {
  const data = useAppData();
  for (const c of chapters) {
    for (const l of c.lessons) {
      if (isReady(l) && !data.progress[c.id]?.completed.includes(l.id)) return { chapter: c, lesson: l };
    }
  }
  return null;
}

export default function PathView() {
  const t = useTranslations("path");
  const tp = useTranslations("player");
  const locale = useLocale();
  const data = useAppData();
  const hydrated = useHydrated();
  const next = useNextLesson();
  const anyStarted = Object.values(data.progress).some((p) => p.completed.length > 0);
  let n = 0;

  return (
    <div className="mx-auto max-w-page px-5 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
        <div>
          <h1>{t("title")}</h1>
          <p className="mt-3 text-lg">{t("intro")}</p>
        </div>
        <div className="space-y-4">
          {hydrated && data.dailyGoal === null ? (
            <div className="rounded-md border-2 border-ink bg-white p-5">
              <GoalChooser />
            </div>
          ) : (
            <GoalSummary />
          )}
        </div>
      </div>

      <ol className="mt-10 space-y-12">
        {chapters.map((chapter, ci) => {
          const done = data.progress[chapter.id]?.completed ?? [];
          const ready = chapter.lessons.some(isReady);
          const finished = Boolean(data.progress[chapter.id]?.finishedAt);
          return (
            <li key={chapter.id} className="max-w-none">
              <section aria-labelledby={`ch-${chapter.id}`}>
                <div className={`rounded-md border-2 p-5 ${ready ? "border-ink bg-green-wash" : "border-dashed border-line-soft bg-white"}`}>
                  <p className="font-bold text-ink-soft">{t("chapterOf", { number: ci + 1 })}</p>
                  <h2 id={`ch-${chapter.id}`} className="mt-1">
                    {pick(chapter.title, locale)}
                  </h2>
                  <p className="mt-1">{pick(chapter.description, locale)}</p>
                  {ready ? (
                    <p className="mt-2 font-bold">{t("chapterProgress", { done: done.length, total: chapter.lessons.length })}</p>
                  ) : (
                    <p className="mt-2 font-bold text-ink-soft">{t("chapterComingSoon")}</p>
                  )}
                  {finished && (
                    <TextLink href={`/certificate/${chapter.id}`} className="mt-1">
                      {t("certificate")}
                    </TextLink>
                  )}
                </div>

                <ol className="mt-6 space-y-5">
                  {chapter.lessons.map((lesson, li) => {
                    const offset = OFFSETS[n++ % OFFSETS.length];
                    const isDone = done.includes(lesson.id);
                    const isNext = hydrated && next?.chapter.id === chapter.id && next.lesson.id === lesson.id;
                    const can = isReady(lesson);
                    const circle = (
                      <span
                        className={`flex shrink-0 items-center justify-center rounded-full border-[3px] font-heading text-2xl ${
                          isNext ? "h-20 w-20" : "h-16 w-16"
                        } ${
                          isDone
                            ? "border-green bg-green text-white"
                            : isNext
                              ? "border-ink bg-marigold text-ink"
                              : can
                                ? "border-ink bg-white text-ink"
                                : "border-dashed border-line-soft bg-paper text-ink-soft"
                        }`}
                      >
                        {isDone ? <Icon name="check" className="h-8 w-8" /> : li + 1}
                      </span>
                    );
                    const label = (
                      <span className="flex flex-col">
                        {isNext && <span className="font-bold text-ink">{anyStarted ? t("continueHere") : t("startHere")} →</span>}
                        <span className={`text-xl ${can ? "text-green underline decoration-2 underline-offset-4" : "text-ink-soft"}`}>
                          {pick(lesson.title, locale)}
                        </span>
                        <span className="text-ink-soft">
                          {isDone ? `${t("done")} ✓ · ` : !can ? `${t("comingSoon")} · ` : ""}
                          {t("minutes", { count: lesson.minutes })}
                        </span>
                      </span>
                    );
                    return (
                      <li key={lesson.id} className="max-w-none" style={{ marginLeft: `max(0rem, calc(4% + ${offset}))` }}>
                        {can ? (
                          <Link
                            href={`/learn/${chapter.id}/${lesson.id}`}
                            className="group inline-flex min-h-[4rem] items-center gap-4 rounded-md pr-3 no-underline hover:bg-white"
                          >
                            {circle}
                            {label}
                            {isNext && <Nati mood="talk" className="hidden w-14 text-ink sm:block" />}
                          </Link>
                        ) : (
                          <div className="inline-flex min-h-[4rem] items-center gap-4">
                            {circle}
                            {label}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            </li>
          );
        })}
      </ol>
      <p className="mt-12 font-hand text-xl text-green-dark">{tp("natiHello")}</p>
    </div>
  );
}

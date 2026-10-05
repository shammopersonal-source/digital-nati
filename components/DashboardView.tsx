"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { chapters, getLesson, isReady, pick, type Chapter, type Lesson } from "@/content/path";
import { useAppData, useHydrated, type AppData } from "@/lib/storage";
import { whatsappLink } from "@/lib/site";
import { ButtonAnchor, ButtonLink, TextLink } from "./Button";
import Icon from "./Icon";
import GoalSummary from "./learn/GoalSummary";

/** The lesson to suggest next: the unfinished one opened last, else the next ready one on the path. */
function suggestNext(data: AppData): { course: Chapter; lesson: Lesson } | null {
  const done = (c: string, l: string) => data.progress[c]?.completed.includes(l);
  if (data.lastVisited) {
    const { courseId, lessonId } = data.lastVisited;
    const lesson = getLesson(courseId, lessonId);
    const course = chapters.find((c) => c.id === courseId);
    if (course && lesson && isReady(lesson) && !done(courseId, lessonId)) return { course, lesson };
  }
  for (const course of chapters) {
    const next = course.lessons.find((l) => isReady(l) && !done(course.id, l.id));
    if (next) return { course, lesson: next };
  }
  return null;
}

export default function DashboardView() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("path");
  const locale = useLocale();
  const data = useAppData();
  const hydrated = useHydrated();

  const started = Object.values(data.progress).some((p) => p.completed.length > 0) || data.lastVisited !== null;
  const next = suggestNext(data);
  const inProgress = chapters.filter((c) => (data.progress[c.id]?.completed.length ?? 0) > 0 && !data.progress[c.id]?.finishedAt);
  const finished = chapters.filter((c) => data.progress[c.id]?.finishedAt);
  const totalDone = Object.values(data.progress).reduce((n, p) => n + p.completed.length, 0);
  const learner = data.learner;

  // Avoid showing "you haven't started" for a moment before saved progress loads.
  if (!hydrated) return <div className="mx-auto min-h-[60vh] max-w-page px-5 py-8" />;

  return (
    <div className="mx-auto max-w-page px-5 py-8">
      <h1>{learner?.name ? t("greeting", { name: learner.name }) : t("greetingNoName")}</h1>

      <section aria-labelledby="continue" className="mt-8 rounded-md border-2 border-ink bg-white p-6">
        <h2 id="continue" className="text-xl">
          {t("continueTitle")}
        </h2>
        {next ? (
          <>
            {!started && <p className="mt-2 text-lg">{t("nothingYet")}</p>}
            {started && <p className="mt-2 text-ink-soft">{pick(next.course.title, locale)}</p>}
            <ButtonLink href={`/learn/${next.course.id}/${next.lesson.id}`} className="mt-4 text-xl">
              {started
                ? t("continue", { lesson: pick(next.lesson.title, locale) })
                : t("startFirst", { lesson: pick(next.lesson.title, locale) })}
              <Icon name="arrowRight" />
            </ButtonLink>
          </>
        ) : (
          <p className="mt-2 text-lg">{tc("chapterComingSoon")}</p>
        )}
      </section>

      <div className="mt-8 max-w-md">
        <GoalSummary />
      </div>

      {inProgress.length > 0 && (
        <section aria-labelledby="doing" className="mt-10">
          <h2 id="doing">{t("inProgressTitle")}</h2>
          <ul className="mt-4 border-t-2 border-ink">
            {inProgress.map((c) => (
              <li key={c.id} className="max-w-none border-b-2 border-line-soft py-4">
                <Link href="/learn" className="text-link inline-flex min-h-[2.8rem] items-center font-heading text-xl">
                  {pick(c.title, locale)}
                </Link>
                <p>{tc("chapterProgress", { done: data.progress[c.id].completed.length, total: c.lessons.length })}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="finished" className="mt-10">
        <h2 id="finished">{t("finishedTitle")}</h2>
        {finished.length === 0 ? (
          <p className="mt-3">{t("noneFinished")}</p>
        ) : (
          <ul className="mt-4 border-t-2 border-ink">
            {finished.map((c) => (
              <li key={c.id} className="flex max-w-none flex-wrap items-center justify-between gap-3 border-b-2 border-line-soft py-4">
                <span className="font-heading text-xl">
                  <span className="text-green">✓</span> {pick(c.title, locale)}
                </span>
                <TextLink href={`/certificate/${c.id}`}>{t("certificate")}</TextLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="helper" className="mt-10 rounded-md border-2 border-ink bg-green-wash p-6">
        <h2 id="helper" className="text-xl">
          {t("helperTitle")}
        </h2>
        {learner?.helper ? (
          <ButtonAnchor
            variant="secondary"
            className="mt-4"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink(
              { display: learner.helper.phone, international: `88${learner.helper.phone}` },
              t("progressMessage", {
                helper: learner.helper.name || "",
                name: learner.name || "",
                done: totalDone,
                current: next ? pick(next.lesson.title, locale) : "—",
              }),
            )}
          >
            <Icon name="chat" />
            {t("sendProgress", { name: learner.helper.name || learner.helper.phone })}
          </ButtonAnchor>
        ) : (
          <p className="mt-2">
            {t("noHelper")}{" "}
            <Link href="/settings" className="text-link font-bold">
              {t("settings")}
            </Link>
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-col items-start gap-1">
        {!learner?.name && <TextLink href="/settings">{t("addName")}</TextLink>}
        <TextLink href="/practice">{t("practiceRoom")}</TextLink>
        <TextLink href="/settings">{t("settings")}</TextLink>
        <p className="text-ink-soft">{t("savedHere")}</p>
      </div>
    </div>
  );
}

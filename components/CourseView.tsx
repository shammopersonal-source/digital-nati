"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseMinutes, getCourse, isReady, pick } from "@/content/courses";
import { useAppData } from "@/lib/storage";
import { ButtonLink, TextLink } from "./Button";
import Icon from "./Icon";
import { AppSketch } from "./illustrations/Drawings";

export default function CourseView({ courseId }: { courseId: string }) {
  const t = useTranslations("course");
  const tc = useTranslations("common");
  const tcs = useTranslations("courses");
  const locale = useLocale();
  const data = useAppData();
  const course = getCourse(courseId)!;

  const progress = data.progress[course.id];
  const completed = progress?.completed ?? [];
  const finished = Boolean(progress?.finishedAt);
  const readyLessons = course.lessons.filter(isReady);
  const visitedHere = data.lastVisited?.courseId === course.id ? data.lastVisited.lessonId : null;
  // The lesson to continue with: the one they last opened, else the first ready lesson not yet done.
  const nextIndex = course.lessons.findIndex(
    (l) => isReady(l) && (visitedHere ? l.id === visitedHere && !completed.includes(l.id) : !completed.includes(l.id)),
  );
  const fallbackIndex = course.lessons.findIndex((l) => isReady(l) && !completed.includes(l.id));
  const index = nextIndex >= 0 ? nextIndex : fallbackIndex;
  const nextLesson = index >= 0 ? course.lessons[index] : null;

  return (
    <div className="mx-auto max-w-page px-5 py-8">
      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1>{pick(course.title, locale)}</h1>
          <p className="mt-3 text-lg">{pick(course.description, locale)}</p>
          <p className="mt-1 text-ink-soft">
            {tc("lessons", { count: course.lessons.length })} · {tcs("totalTime", { minutes: courseMinutes(course) })}
          </p>
        </div>
        <AppSketch kind={course.app} className="w-36 shrink-0 text-ink sm:w-44" />
      </div>

      <div className="mt-8">
        {finished ? (
          <div className="rounded-md border-2 border-green bg-green-wash p-5">
            <p className="text-lg font-bold">{t("finished")}</p>
            <ButtonLink href={`/certificate/${course.id}`} className="mt-4">
              {t("certificate")}
            </ButtonLink>
          </div>
        ) : nextLesson ? (
          <ButtonLink href={`/courses/${course.id}/${nextLesson.id}`} className="text-xl">
            {completed.length > 0 || visitedHere
              ? t("continue", { lesson: pick(nextLesson.title, locale) })
              : t("start", { number: index + 1, lesson: pick(nextLesson.title, locale) })}
            <Icon name="arrowRight" />
          </ButtonLink>
        ) : (
          readyLessons.length === 0 && (
            <p className="rounded-md border-2 border-dashed border-ink bg-white p-5 text-lg">{t("allComingSoon")}</p>
          )
        )}
      </div>

      <h2 className="mt-12">{t("lessonsTitle")}</h2>
      <ol className="mt-4 border-t-2 border-ink">
        {course.lessons.map((lesson, i) => {
          const done = completed.includes(lesson.id);
          const ready = isReady(lesson);
          const row = (
            <>
              <span className="font-heading text-2xl text-ink-soft">{i + 1}.</span>
              <span className="flex flex-col">
                <span className={ready ? "text-lg text-green underline decoration-2 underline-offset-4" : "text-lg"}>
                  {pick(lesson.title, locale)}
                </span>
                <span className="text-ink-soft">{tc("minutes", { count: lesson.minutes })}</span>
              </span>
              <span className="justify-self-end text-right font-bold">
                {done ? <span className="text-green">{t("done")}</span> : !ready ? t("comingSoon") : null}
              </span>
            </>
          );
          const rowClass = "grid min-h-[3.5rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b-2 border-line-soft py-4";
          return (
            <li key={lesson.id} className="max-w-none">
              {ready ? (
                <Link href={`/courses/${course.id}/${lesson.id}`} className={`${rowClass} hover:bg-white`}>
                  {row}
                </Link>
              ) : (
                <div className={rowClass}>{row}</div>
              )}
            </li>
          );
        })}
      </ol>

      <TextLink href="/courses" className="mt-6">
        {t("allCourses")}
      </TextLink>
    </div>
  );
}

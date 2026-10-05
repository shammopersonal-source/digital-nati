"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseMinutes, courses, isReady, pick, type Course } from "@/content/courses";
import { useAppData, type AppData } from "@/lib/storage";
import { AppSketch } from "./illustrations/Drawings";

export function courseStatus(course: Course, data: AppData) {
  const done = data.progress[course.id]?.completed.length ?? 0;
  const ready = course.lessons.some(isReady);
  if (data.progress[course.id]?.finishedAt) return { kind: "finished" as const, done };
  if (done > 0) return { kind: "inProgress" as const, done };
  if (!ready) return { kind: "comingSoon" as const, done };
  return { kind: "notStarted" as const, done };
}

/** The list of courses: a picture, the title, what it covers and how far the learner has got. */
export default function CourseList({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("courses");
  const tc = useTranslations("common");
  const locale = useLocale();
  const data = useAppData();

  return (
    <ol className={`border-t-2 border-ink ${compact ? "grid gap-x-10 md:grid-cols-2" : ""}`}>
      {courses.map((course, i) => {
        const status = courseStatus(course, data);
        const first = i === 0;
        return (
          <li key={course.id} className="max-w-none border-b-2 border-line-soft py-5">
            {first && !compact && (
              <p className="mb-3 inline-block rounded-sm bg-marigold-wash px-3 py-1 font-bold">{t("startHere")}</p>
            )}
            <Link href={`/courses/${course.id}`} className="group flex items-start gap-5 no-underline">
              <span className="w-28 shrink-0 text-ink sm:w-36">
                {course.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.screenshot} alt="" className="w-full rounded-sm border-2 border-ink" loading="lazy" />
                ) : (
                  <AppSketch kind={course.app} className="w-full" />
                )}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-heading text-xl text-green underline decoration-2 underline-offset-4 group-hover:decoration-4">
                  <span className="text-ink-soft no-underline">{i + 1}. </span>
                  {pick(course.title, locale)}
                </span>
                <span>{pick(course.description, locale)}</span>
                {!compact && (
                  <span className="text-ink-soft">
                    {tc("lessons", { count: course.lessons.length })} · {t("totalTime", { minutes: courseMinutes(course) })}
                  </span>
                )}
                <span className={`font-bold ${status.kind === "finished" ? "text-green" : ""}`}>
                  {status.kind === "inProgress"
                    ? t("inProgress", { done: status.done, total: course.lessons.length })
                    : !compact || status.kind === "finished" || status.kind === "comingSoon"
                      ? t(status.kind)
                      : null}
                </span>
                {first && compact && <span className="font-bold">{t("startHere")}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

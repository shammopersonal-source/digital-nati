"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getLesson, pick, type Practice } from "@/content/courses";
import { playground, practices } from "./practice";
import { TextLink } from "./Button";

/** One exercise in the practice room. Nothing is saved or counted here. */
export default function PracticeActivity({ id }: { id: string }) {
  const t = useTranslations("playground");
  const locale = useLocale();
  const [done, setDone] = useState(false);
  const item = playground.find((p) => p.id === id)!;
  const Exercise = practices[item.id as Practice];
  const lesson = getLesson(item.lesson.courseId, item.lesson.lessonId);

  return (
    <div className="mx-auto max-w-page px-5 py-8">
      <h1>{t(`${item.id}Title`)}</h1>
      <p className="mt-3 text-lg">{t(`${item.id}Text`)}</p>

      <div className="mt-8">
        <Exercise onDone={() => setDone(true)} />
      </div>

      <div aria-live="polite" className="mt-8 border-t-2 border-ink pt-6">
        {done && <p className="mb-3 text-lg font-bold text-green">{t("doneNote")}</p>}
        <div className="flex flex-col items-start gap-1">
          <TextLink href="/practice">{t("tryAnother")}</TextLink>
          {lesson && (
            <TextLink href={`/courses/${item.lesson.courseId}/${item.lesson.lessonId}`}>
              {t("lessonLink", { lesson: pick(lesson.title, locale) })}
            </TextLink>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { chapters, exerciseByKey, exerciseKey } from "@/content/path";
import { useAppData, useHydrated, type AppData } from "@/lib/storage";
import { ButtonLink } from "../Button";
import { Nati } from "../illustrations/Drawings";
import LessonPlayer, { type Item } from "./LessonPlayer";

const SIZE = 8;

/** Up to 8 questions: the ones the learner found hard first, then others from finished lessons. */
export function buildReview(data: AppData, seed = Date.now()): Item[] {
  const hard = data.mistakes
    .map((key) => ({ key, ex: exerciseByKey(key)! }))
    .filter((i) => i.ex && i.ex.kind !== "learn");
  const others: Item[] = [];
  for (const c of chapters) {
    for (const l of c.lessons) {
      if (!data.progress[c.id]?.completed.includes(l.id)) continue;
      l.exercises?.forEach((ex, i) => {
        const key = exerciseKey(c.id, l.id, i);
        // Typing your name and pressing keys for real are better done in lessons.
        if (ex.kind !== "learn" && ex.kind !== "do" && !data.mistakes.includes(key)) others.push({ key, ex });
      });
    }
  }
  let h = seed >>> 0;
  for (let i = others.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [others[i], others[j]] = [others[j], others[i]];
  }
  return [...hard, ...others].slice(0, SIZE);
}

export default function ReviewSession() {
  const t = useTranslations("review");
  const data = useAppData();
  const hydrated = useHydrated();
  // Build once, when saved progress has loaded.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => (hydrated ? buildReview(data) : []), [hydrated]);

  if (!hydrated) return <div className="min-h-screen" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <Nati className="mx-auto w-28 text-ink" />
        <h1 className="mt-6">{t("sessionTitle")}</h1>
        <p className="mt-3 text-lg">{t("none")}</p>
        <ButtonLink href="/learn" className="mt-8">
          {t("goToPath")}
        </ButtonLink>
      </div>
    );
  }

  return <LessonPlayer items={items} title={t("sessionTitle")} exitHref="/practice" />;
}

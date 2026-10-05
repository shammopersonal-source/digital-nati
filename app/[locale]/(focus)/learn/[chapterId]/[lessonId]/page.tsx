import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { chapters, exerciseKey, getChapter, getLesson, pick } from "@/content/path";
import LessonPlayer from "@/components/learn/LessonPlayer";
import { ButtonLink } from "@/components/Button";
import { Nati } from "@/components/illustrations/Drawings";

type Props = PageProps<"/[locale]/learn/[chapterId]/[lessonId]">;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    chapters.flatMap((c) => c.lessons.map((l) => ({ locale, chapterId: c.id, lessonId: l.id }))),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, chapterId, lessonId } = await params;
  const lesson = getLesson(chapterId, lessonId);
  return lesson ? { title: pick(lesson.title, locale) } : {};
}

export default async function LessonPage({ params }: Props) {
  const { locale, chapterId, lessonId } = await params;
  setRequestLocale(locale);
  const chapter = getChapter(chapterId);
  const lesson = getLesson(chapterId, lessonId);
  if (!chapter || !lesson) notFound();

  if (!lesson.exercises?.length) {
    const t = await getTranslations("path");
    const tp = await getTranslations("player");
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <Nati className="mx-auto w-28 text-ink" />
        <h1 className="mt-6">{pick(lesson.title, locale)}</h1>
        <p className="mt-3 text-lg">{t("comingSoon")}</p>
        <ButtonLink href="/learn" className="mt-8">
          {tp("backToPath")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <LessonPlayer
      title={pick(lesson.title, locale)}
      lesson={{ chapterId, lessonId }}
      exitHref="/learn"
      items={lesson.exercises.map((ex, i) => ({ key: exerciseKey(chapterId, lessonId, i), ex }))}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { courses, getCourse, getLesson, pick } from "@/content/courses";
import PageTop from "@/components/PageTop";
import LessonView from "@/components/LessonView";
import { TextLink } from "@/components/Button";

type Props = PageProps<"/[locale]/courses/[courseId]/[lessonId]">;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    courses.flatMap((c) => c.lessons.map((l) => ({ locale, courseId: c.id, lessonId: l.id }))),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, courseId, lessonId } = await params;
  const lesson = getLesson(courseId, lessonId);
  return lesson ? { title: pick(lesson.title, locale) } : {};
}

export default async function LessonPage({ params }: Props) {
  const { locale, courseId, lessonId } = await params;
  setRequestLocale(locale);
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  if (!course || !lesson) notFound();

  const t = await getTranslations("lesson");
  const tc = await getTranslations("courses");
  const index = course.lessons.indexOf(lesson);

  return (
    <>
      <PageTop
        back={`/courses/${course.id}`}
        crumbs={[
          { label: tc("title"), href: "/courses" },
          { label: pick(course.title, locale), href: `/courses/${course.id}` },
          { label: (await getTranslations("common"))("lessonOf", { current: index + 1, total: course.lessons.length }) },
        ]}
      />
      {lesson.content ? (
        <LessonView courseId={course.id} lessonId={lesson.id} />
      ) : (
        <div className="mx-auto max-w-page px-5 py-8">
          <h1>{pick(lesson.title, locale)}</h1>
          <div className="mt-6 rounded-md border-2 border-dashed border-ink bg-white p-6">
            <h2 className="text-xl">{t("notReadyTitle")}</h2>
            <p className="mt-2 text-lg">{t("notReadyText")}</p>
          </div>
          <TextLink href={`/courses/${course.id}`} className="mt-6">
            {t("backToCourse")}
          </TextLink>
        </div>
      )}
    </>
  );
}

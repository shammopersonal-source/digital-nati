import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { courses, getCourse, pick } from "@/content/courses";
import PageTop from "@/components/PageTop";
import CourseView from "@/components/CourseView";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => courses.map((c) => ({ locale, courseId: c.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/courses/[courseId]">): Promise<Metadata> {
  const { locale, courseId } = await params;
  const course = getCourse(courseId);
  return course ? { title: pick(course.title, locale) } : {};
}

export default async function CoursePage({ params }: PageProps<"/[locale]/courses/[courseId]">) {
  const { locale, courseId } = await params;
  setRequestLocale(locale);
  const course = getCourse(courseId);
  if (!course) notFound();
  const t = await getTranslations("courses");

  return (
    <>
      <PageTop
        back="/courses"
        crumbs={[{ label: t("title"), href: "/courses" }, { label: pick(course.title, locale) }]}
      />
      <CourseView courseId={course.id} />
    </>
  );
}

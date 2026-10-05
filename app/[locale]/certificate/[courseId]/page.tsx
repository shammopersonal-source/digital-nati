import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { courses, getCourse, pick } from "@/content/courses";
import PageTop from "@/components/PageTop";
import CertificateView from "@/components/CertificateView";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => courses.map((c) => ({ locale, courseId: c.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/certificate/[courseId]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "certificate" });
  return { title: t("title") };
}

export default async function CertificatePage({ params }: PageProps<"/[locale]/certificate/[courseId]">) {
  const { locale, courseId } = await params;
  setRequestLocale(locale);
  const course = getCourse(courseId);
  if (!course) notFound();
  const t = await getTranslations("dashboard");
  return (
    <>
      <PageTop
        back="/my-learning"
        crumbs={[{ label: t("title"), href: "/my-learning" }, { label: pick(course.title, locale) }]}
      />
      <CertificateView courseId={course.id} />
    </>
  );
}

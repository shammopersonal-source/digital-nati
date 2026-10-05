import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import CourseList from "@/components/CourseList";

export async function generateMetadata({ params }: PageProps<"/[locale]/courses">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "courses" });
  return { title: t("title") };
}

export default async function CoursesPage({ params }: PageProps<"/[locale]/courses">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Courses />;
}

function Courses() {
  const t = useTranslations("courses");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("title") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("title")}</h1>
        <p className="mt-3 text-lg">{t("intro")}</p>
        <div className="mt-8">
          <CourseList />
        </div>
      </div>
    </>
  );
}

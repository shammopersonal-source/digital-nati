import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import DashboardView from "@/components/DashboardView";

export async function generateMetadata({ params }: PageProps<"/[locale]/my-learning">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("title") };
}

export default async function MyLearningPage({ params }: PageProps<"/[locale]/my-learning">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("title") }]} />
      <DashboardView />
    </>
  );
}

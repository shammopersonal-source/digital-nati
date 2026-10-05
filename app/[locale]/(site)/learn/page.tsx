import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import PathView from "@/components/learn/PathView";

export async function generateMetadata({ params }: PageProps<"/[locale]/learn">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "path" });
  return { title: t("title") };
}

export default async function LearnPage({ params }: PageProps<"/[locale]/learn">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("learn") }]} />
      <PathView />
    </>
  );
}

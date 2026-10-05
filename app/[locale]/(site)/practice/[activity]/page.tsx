import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageTop from "@/components/PageTop";
import PracticeActivity from "@/components/PracticeActivity";
import { playground } from "@/components/practice";

type Props = PageProps<"/[locale]/practice/[activity]">;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => playground.map((p) => ({ locale, activity: p.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, activity } = await params;
  const t = await getTranslations({ locale, namespace: "playground" });
  return playground.some((p) => p.id === activity) ? { title: t(`${activity}Title`) } : {};
}

export default async function PracticeActivityPage({ params }: Props) {
  const { locale, activity } = await params;
  setRequestLocale(locale);
  if (!playground.some((p) => p.id === activity)) notFound();
  const t = await getTranslations("playground");
  return (
    <>
      <PageTop back="/practice" crumbs={[{ label: (await getTranslations("review"))("title"), href: "/practice" }, { label: t(`${activity}Title`) }]} />
      <PracticeActivity id={activity} />
    </>
  );
}

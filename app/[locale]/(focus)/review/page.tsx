import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ReviewSession from "@/components/learn/ReviewSession";

export async function generateMetadata({ params }: PageProps<"/[locale]/review">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "review" });
  return { title: t("sessionTitle") };
}

export default async function ReviewPage({ params }: PageProps<"/[locale]/review">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReviewSession />;
}

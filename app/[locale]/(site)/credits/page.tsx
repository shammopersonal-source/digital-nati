import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import { photoCredits } from "@/lib/photoCredits";

export async function generateMetadata({ params }: PageProps<"/[locale]/credits">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return { title: t("title") };
}

export default async function CreditsPage({ params }: PageProps<"/[locale]/credits">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Credits />;
}

function Credits() {
  const t = useTranslations("credits");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("title") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("title")}</h1>
        <p className="mt-3 text-lg">{t("intro")}</p>
        <ul className="mt-8 border-t-2 border-ink">
          {photoCredits.map((c) => (
            <li key={c.file} className="flex max-w-none flex-col gap-4 border-b-2 border-line-soft py-5 sm:flex-row sm:items-center">
              <Image src={`/photos/${c.file}`} alt="" width={160} height={120} className="h-[7.5rem] w-40 shrink-0 rounded-md bg-white object-contain" />
              <div>
                <p className="font-bold">{c.title}</p>
                <p>
                  {t("author")}: {c.author}
                </p>
                <p>
                  {t("licence")}:{" "}
                  <a href={c.licenceUrl} className="text-link" target="_blank" rel="noopener noreferrer">
                    {c.licence}
                  </a>
                </p>
                <a href={c.source} className="text-link inline-flex min-h-[2.8rem] items-center" target="_blank" rel="noopener noreferrer">
                  {t("source")}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink-soft">{t("changed")}</p>
      </div>
    </>
  );
}

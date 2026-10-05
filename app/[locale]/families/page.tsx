import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import { ButtonLink } from "@/components/Button";
import ContactButtons from "@/components/ContactButtons";
import { PhoneMessage } from "@/components/illustrations/Drawings";

export async function generateMetadata({ params }: PageProps<"/[locale]/families">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "families" });
  return { title: t("title") };
}

export default async function FamiliesPage({ params }: PageProps<"/[locale]/families">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Families />;
}

function Families() {
  const t = useTranslations("families");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("title") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <div className="grid items-start gap-8 sm:grid-cols-[1fr_9rem]">
          <div>
            <h1>{t("title")}</h1>
            <p className="mt-3 text-lg">{t("intro")}</p>
          </div>
          <PhoneMessage className="hidden w-32 text-ink sm:block" />
        </div>

        <section aria-labelledby="setup" className="mt-10">
          <h2 id="setup">
            <span className="text-green">1.</span> {t("setupTitle")}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-8 text-lg marker:font-bold">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n}>{t(`setup${n}`)}</li>
            ))}
          </ol>
          <ButtonLink href="/signup" className="mt-6 text-xl">
            {t("cta")}
          </ButtonLink>
        </section>

        <section aria-labelledby="progress" className="mt-12">
          <h2 id="progress">
            <span className="text-green">2.</span> {t("progressTitle")}
          </h2>
          <p className="mt-3 text-lg">{t("progressText")}</p>
        </section>

        <section aria-labelledby="tips" className="mt-12 rounded-md border-2 border-ink bg-marigold-wash p-6">
          <h2 id="tips">
            <span className="text-green">3.</span> {t("tipsTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-lg">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li key={n} className="flex gap-3">
                <span aria-hidden="true" className="font-bold">—</span>
                {t(`tip${n}`)}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ask" className="mt-12">
          <h2 id="ask" className="text-xl">
            {t("contact")}
          </h2>
          <div className="mt-4">
            <ContactButtons quiet />
          </div>
        </section>
      </div>
    </>
  );
}

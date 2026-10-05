import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import ContactButtons from "@/components/ContactButtons";
import VideoPlayer from "@/components/VideoPlayer";

export async function generateMetadata({ params }: PageProps<"/[locale]/help">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "helpPage" });
  return { title: t("title") };
}

export default async function HelpPage({ params }: PageProps<"/[locale]/help">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Help />;
}

function Help() {
  const t = useTranslations("helpPage");
  const questions = [1, 2, 3, 4, 5, 6, 7] as const;
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("title") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("title")}</h1>
        <p className="mt-3 text-lg">{t("intro")}</p>

        <section aria-labelledby="talk" className="mt-8">
          <h2 id="talk">{t("contactTitle")}</h2>
          <div className="mt-4">
            <ContactButtons />
          </div>
        </section>

        <section aria-labelledby="faq" className="mt-12">
          <h2 id="faq">{t("faqTitle")}</h2>
          <div className="mt-4 border-t-2 border-ink">
            {questions.map((n) => (
              <div key={n} className="border-b-2 border-line-soft py-6">
                <h3>{t(`q${n}`)}</h3>
                <p className="mt-2 text-lg">{t(`a${n}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="video" className="mt-12">
          <h2 id="video">{t("videoTitle")}</h2>
          <div className="mt-4">
            <VideoPlayer placeholderKey="placeholderHelp" />
          </div>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PageTop from "@/components/PageTop";
import { playground } from "@/components/practice";
import { FigureDrawing, isWideFigure } from "@/components/illustrations/Drawings";

export async function generateMetadata({ params }: PageProps<"/[locale]/practice">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "playground" });
  return { title: t("title") };
}

export default async function PracticeRoomPage({ params }: PageProps<"/[locale]/practice">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PracticeRoom />;
}

function PracticeRoom() {
  const t = useTranslations("playground");
  const th = useTranslations("home");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("title") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("title")}</h1>
        <p className="mt-3 text-lg">{t("intro")}</p>
        <p className="mt-2 text-ink-soft">{t("note")}</p>
        <p className="mt-4 -rotate-1 font-hand text-xl text-green-dark">{th("marginNote")}</p>

        <h2 className="mt-10">{t("chooseTitle")}</h2>
        <ul className="mt-4 border-t-2 border-ink">
          {playground.map((item) => (
            <li key={item.id} className="max-w-none border-b-2 border-line-soft">
              <Link href={`/practice/${item.id}`} className="group flex items-center gap-5 py-5 no-underline hover:bg-white">
                <span className="w-32 shrink-0 text-ink sm:w-44">
                  <span className={`block ${isWideFigure(item.figure) ? "" : "mx-auto w-20 sm:w-24"}`}>
                    <FigureDrawing figure={item.figure} />
                  </span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-heading text-xl text-green underline decoration-2 underline-offset-4 group-hover:decoration-4">
                    {t(`${item.id}Title`)}
                  </span>
                  <span>{t(`${item.id}Text`)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import AuthForm from "@/components/AuthForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle") };
}

export default async function Page({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("loginTitle") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("loginTitle")}</h1>
        <p className="mt-3 text-lg">{t("loginIntro")}</p>
        <AuthForm mode="login" />
      </div>
    </>
  );
}

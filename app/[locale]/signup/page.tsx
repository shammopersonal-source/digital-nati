import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTop from "@/components/PageTop";
import AuthForm from "@/components/AuthForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/signup">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signupTitle") };
}

export default async function Page({ params }: PageProps<"/[locale]/signup">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <>
      <PageTop back="/" crumbs={[{ label: t("signupTitle") }]} />
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("signupTitle")}</h1>
        <p className="mt-3 text-lg">{t("signupIntro")}</p>
        <AuthForm mode="signup" />
      </div>
    </>
  );
}

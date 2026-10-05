import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/Button";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-page px-5 py-16">
          <h1>{t("title")}</h1>
          <p className="mt-4 text-lg">{t("text")}</p>
          <div className="mt-8">
            <ButtonLink href="/">{t("home")}</ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

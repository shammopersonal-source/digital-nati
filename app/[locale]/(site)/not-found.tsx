import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="mx-auto max-w-page px-5 py-16">
      <h1>{t("title")}</h1>
      <p className="mt-4 text-lg">{t("text")}</p>
      <div className="mt-8">
        <ButtonLink href="/">{t("home")}</ButtonLink>
      </div>
    </div>
  );
}

import { useTranslations } from "next-intl";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HelpButton from "@/components/HelpButton";

/** Ordinary pages: header with the menu, footer, and the floating "Need help?" button. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  return (
    <>
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-4"
      >
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <main id="main" className="flex-1 pb-28">
        {children}
      </main>
      <SiteFooter />
      <HelpButton />
    </>
  );
}

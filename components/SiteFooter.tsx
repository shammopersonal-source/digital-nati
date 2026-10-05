import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { karjoPrimeUrl, karjoUrl, phones, telLink, whatsappLink } from "@/lib/site";

export default function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const links = [
    { href: "/courses", label: nav("courses") },
    { href: "/my-learning", label: nav("myLearning") },
    { href: "/help", label: nav("help") },
    { href: "/families", label: nav("families") },
    { href: "/settings", label: nav("settings") },
    { href: "/signup", label: nav("signup") },
    { href: "/login", label: nav("login") },
  ] as const;

  return (
    <footer className="no-print border-t-2 border-ink bg-paper-deep">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-10 md:grid-cols-[3fr_2fr]">
        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="text-xl">
            {t("contactTitle")}
          </h2>
          <p className="mt-1">{t("contactText")}</p>
          <ul className="mt-4 space-y-3">
            {phones.map((p) => (
              <li key={p.international} className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span className="min-w-[8.5rem] text-lg font-bold tracking-wide">{p.display}</span>
                <a href={telLink(p)} className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold">
                  {t("call")}
                </a>
                <a
                  href={whatsappLink(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold"
                >
                  {t("whatsapp")}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3 border-t border-line-soft pt-6">
            <p>
              {t("initiative")}{" "}
              <a href={karjoUrl} className="text-link font-bold" target="_blank" rel="noopener noreferrer">
                {t("karjoLink")}
              </a>
            </p>
            <p>
              {t("prime")}
              {karjoPrimeUrl && (
                <>
                  {" "}
                  <a href={karjoPrimeUrl} className="text-link font-bold" target="_blank" rel="noopener noreferrer">
                    {t("primeLink")}
                  </a>
                </>
              )}
            </p>
          </div>
        </section>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="text-xl">
            {t("linksTitle")}
          </h2>
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-link inline-flex min-h-[2.8rem] items-center text-lg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-page px-5 pb-8 font-hand text-xl text-ink-soft">{t("madeWithCare")}</p>
    </footer>
  );
}

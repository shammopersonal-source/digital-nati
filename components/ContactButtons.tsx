import { useTranslations } from "next-intl";
import { phones, telLink, whatsappLink } from "@/lib/site";
import { ButtonAnchor } from "./Button";
import Icon from "./Icon";

/** Both numbers, each with a big Call and a big WhatsApp button. */
export default function ContactButtons({ compact = false, quiet = false }: { compact?: boolean; quiet?: boolean }) {
  const t = useTranslations("help");
  return (
    <ul className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      {phones.map((p) => (
        <li key={p.international} className="flex flex-col gap-3 rounded-md border-2 border-ink bg-white p-4">
          <p className="text-xl font-bold tracking-wide">{p.display}</p>
          <ButtonAnchor href={telLink(p)} variant={quiet ? "secondary" : "primary"}>
            <Icon name="phone" />
            {t("call", { number: p.display })}
          </ButtonAnchor>
          <ButtonAnchor href={whatsappLink(p)} target="_blank" rel="noopener noreferrer" variant="secondary">
            <Icon name="chat" />
            {t("whatsapp", { number: p.display })}
          </ButtonAnchor>
        </li>
      ))}
    </ul>
  );
}

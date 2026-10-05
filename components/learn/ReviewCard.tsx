"use client";

import { useTranslations } from "next-intl";
import { useAppData, useHydrated } from "@/lib/storage";
import { ButtonLink, TextLink } from "../Button";
import { Nati } from "../illustrations/Drawings";

/** The brush-up button, or a gentle note if there is nothing to brush up yet. */
export default function ReviewCard() {
  const t = useTranslations("review");
  const data = useAppData();
  const hydrated = useHydrated();
  const anyDone = Object.values(data.progress).some((p) => p.completed.length > 0);

  return (
    <div className="flex items-start gap-5 rounded-md border-2 border-ink bg-green-wash p-5 sm:p-6">
      <Nati mood="talk" className="w-16 shrink-0 text-ink sm:w-20" />
      <div className="min-h-[6rem]">
        {hydrated &&
          (anyDone ? (
            <>
              {data.mistakes.length > 0 && <p className="text-lg">{t("hard", { count: data.mistakes.length })}</p>}
              <ButtonLink href="/review" className="mt-3 text-xl">
                {t("start")}
              </ButtonLink>
            </>
          ) : (
            <>
              <p className="text-lg">{t("none")}</p>
              <TextLink href="/learn">{t("goToPath")}</TextLink>
            </>
          ))}
      </div>
    </div>
  );
}

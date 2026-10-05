"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getCourse, pick } from "@/content/courses";
import { saveLearner, useAppData, useHydrated } from "@/lib/storage";
import { Button, ButtonLink } from "./Button";
import Field from "./Field";
import Icon from "./Icon";
import { BrandMark } from "./illustrations/Drawings";

export default function CertificateView({ courseId }: { courseId: string }) {
  const t = useTranslations("certificate");
  const locale = useLocale();
  const data = useAppData();
  const hydrated = useHydrated();
  const [name, setName] = useState("");
  const course = getCourse(courseId)!;
  const finishedAt = data.progress[courseId]?.finishedAt;

  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (!finishedAt) {
    return (
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("title")}</h1>
        <p className="mt-4 text-lg">{t("notFinished", { course: pick(course.title, locale) })}</p>
        <ButtonLink href={`/courses/${courseId}`} className="mt-6">
          {t("goToCourse")}
        </ButtonLink>
      </div>
    );
  }

  if (!data.learner?.name) {
    return (
      <div className="mx-auto max-w-page px-5 py-8">
        <h1>{t("title")}</h1>
        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            saveLearner({ phone: data.learner?.phone ?? "", helper: data.learner?.helper ?? null, name: name.trim() });
          }}
        >
          <Field id="cert-name" label={t("askName")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <Button type="submit">{t("saveName")}</Button>
        </form>
      </div>
    );
  }

  const date = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", { dateStyle: "long" }).format(new Date(finishedAt));

  return (
    <div className="mx-auto max-w-page px-5 py-8 print:p-0">
      <h1 className="no-print">{t("title")}</h1>

      <article className="mt-6 border-[3px] border-double border-ink bg-white p-2 print:mt-0">
        <div className="flex flex-col items-center border-2 border-ink px-6 py-10 text-center sm:px-12 sm:py-14">
          <BrandMark className="h-16 w-16" />
          <p className="mt-6 font-heading text-3xl">{t("heading")}</p>
          <div className="my-6 h-1 w-24 bg-marigold" aria-hidden="true" />
          <p className="text-lg">{t("line1")}</p>
          <p className="mt-3 font-heading text-3xl text-green">{data.learner.name}</p>
          <p className="mt-3 text-lg">{t("line2")}</p>
          <p className="mt-3 font-heading text-2xl">{pick(course.title, locale)}</p>
          <p className="mt-8">{t("date", { date })}</p>
          <p className="mt-6 border-t-2 border-ink pt-3 font-bold">{t("issuer")}</p>
        </div>
      </article>

      <div className="no-print mt-8">
        <Button onClick={() => window.print()} className="text-xl">
          <Icon name="print" />
          {t("print")}
        </Button>
        <p className="mt-3 max-w-prose text-ink-soft">{t("printHelp")}</p>
      </div>
    </div>
  );
}

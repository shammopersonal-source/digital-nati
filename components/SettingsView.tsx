"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { formatPhone, normalisePhone } from "@/lib/auth";
import {
  clearProgress,
  logOut,
  restoreProgress,
  saveLearner,
  useAppData,
  useHydrated,
  type ProgressBackup,
} from "@/lib/storage";
import ReadingSettings from "./ReadingSettings";
import Field from "./Field";
import Dialog from "./Dialog";
import { Button } from "./Button";

export default function SettingsView() {
  const t = useTranslations("settings");
  const tl = useTranslations("language");
  const ta = useTranslations("auth");
  const locale = useLocale();
  const pathname = usePathname();
  const hydrated = useHydrated();

  return (
    <div className="mx-auto max-w-page px-5 py-8">
      <h1>{t("title")}</h1>

      <section aria-labelledby="lang" className="mt-10">
        <h2 id="lang">{t("languageTitle")}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {routing.locales.map((l) => (
            <Link
              key={l}
              href={pathname}
              locale={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              className={`inline-flex min-h-[2.8rem] min-w-[8rem] items-center justify-center rounded-md border-2 border-ink px-5 text-lg font-bold ${
                l === locale ? "bg-green text-white" : "bg-white hover:bg-paper-deep"
              }`}
            >
              {tl(l)}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="reading" className="mt-12">
        <h2 id="reading">{t("readingTitle")}</h2>
        <div className="mt-4 rounded-md border-2 border-ink bg-white p-5">
          <ReadingSettings />
        </div>
      </section>

      {hydrated && <Details t={t} ta={ta} />}
      {hydrated && <Danger t={t} />}
    </div>
  );
}

type T = ReturnType<typeof useTranslations>;

function Details({ t, ta }: { t: T; ta: T }) {
  const { learner } = useAppData();
  const [name, setName] = useState(learner?.name ?? "");
  const [phone, setPhone] = useState(learner?.phone ? formatPhone(learner.phone) : "");
  const [helperName, setHelperName] = useState(learner?.helper?.name ?? "");
  const [helperPhone, setHelperPhone] = useState(learner?.helper?.phone ? formatPhone(learner.helper.phone) : "");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saved, setSaved] = useState(false);

  return (
    <section aria-labelledby="details" className="mt-12">
      <h2 id="details">{t("detailsTitle")}</h2>
      {!learner && <p className="mt-2">{t("noDetails")}</p>}
      <form
        noValidate
        className="mt-4 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const next: Record<string, string | null> = {};
          const p = phone ? normalisePhone(phone) : "";
          const hp = helperPhone ? normalisePhone(helperPhone) : "";
          if (p === null) next.phone = ta("phoneInvalid");
          if (hp === null) next.helperPhone = ta("helperPhoneInvalid");
          setErrors(next);
          setSaved(false);
          if (Object.values(next).some(Boolean)) return;
          saveLearner({
            name: name.trim(),
            phone: p ?? "",
            helper: hp ? { name: helperName.trim(), phone: hp } : null,
          });
          setSaved(true);
        }}
      >
        <Field id="s-name" label={ta("name")} hint={ta("nameHint")} value={name} onChange={(e) => setName(e.target.value)} />
        <Field id="s-phone" label={ta("phone")} hint={ta("phoneHint")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
        <Field id="s-helper-name" label={ta("helperName")} value={helperName} onChange={(e) => setHelperName(e.target.value)} />
        <Field
          id="s-helper-phone"
          label={ta("helperPhone")}
          hint={ta("helperHint")}
          type="tel"
          value={helperPhone}
          onChange={(e) => setHelperPhone(e.target.value)}
          error={errors.helperPhone}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">{t("save")}</Button>
          <p aria-live="polite" className="font-bold text-green">
            {saved && `✓ ${t("detailsSaved")}`}
          </p>
        </div>
      </form>
    </section>
  );
}

function Danger({ t }: { t: T }) {
  const { learner } = useAppData();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [backup, setBackup] = useState<ProgressBackup | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <>
      <section aria-labelledby="reset" className="mt-12 rounded-md border-2 border-ink bg-white p-5">
        <h2 id="reset" className="text-xl">
          {t("resetTitle")}
        </h2>
        <p className="mt-2">{t("resetText")}</p>
        <div aria-live="polite" className="mt-4 flex flex-wrap items-center gap-4">
          {backup ? (
            <>
              <p className="font-bold">{t("removed")}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  restoreProgress(backup);
                  setBackup(null);
                  setStatus(t("restored"));
                }}
              >
                {t("undo")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setConfirmReset(true)}>
                {t("reset")}
              </Button>
              {status && <p className="font-bold text-green">✓ {status}</p>}
            </>
          )}
        </div>
      </section>

      {learner && (
        <section aria-labelledby="logout" className="mt-6 rounded-md border-2 border-ink bg-white p-5">
          <h2 id="logout" className="text-xl">
            {t("logoutTitle")}
          </h2>
          <p className="mt-2">{t("logoutText")}</p>
          <Button variant="secondary" className="mt-4" onClick={() => setConfirmLogout(true)}>
            {t("logout")}
          </Button>
        </section>
      )}
      {status === t("loggedOut") && !learner && <p className="mt-6 font-bold text-green">✓ {status}</p>}

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} title={t("confirmTitle")}>
        <p className="text-lg">{t("confirmText")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            {t("confirmNo")}
          </Button>
          <Button
            onClick={() => {
              setBackup(clearProgress());
              setStatus(null);
              setConfirmReset(false);
            }}
            className="border-brick bg-brick hover:border-brick-text hover:bg-brick-text"
          >
            {t("confirmYes")}
          </Button>
        </div>
      </Dialog>

      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)} title={t("logoutConfirm")}>
        <p className="text-lg">{t("logoutText")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
            {t("confirmNo")}
          </Button>
          <Button
            onClick={() => {
              logOut();
              setConfirmLogout(false);
              setStatus(t("loggedOut"));
            }}
          >
            {t("logoutYes")}
          </Button>
        </div>
      </Dialog>
    </>
  );
}

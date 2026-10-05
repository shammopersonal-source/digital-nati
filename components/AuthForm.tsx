"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { formatPhone, MOCK_OTP, normalisePhone, sendCode, toLatinDigits, verifyCode } from "@/lib/auth";
import { saveLearner, useAppData } from "@/lib/storage";
import { courses } from "@/content/courses";
import { Button, TextLink } from "./Button";
import Field from "./Field";

/** Sign up and log in: name + mobile number, then a 6-number code. No passwords. */
export default function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const data = useAppData();
  const [stage, setStage] = useState<"details" | "code">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [helping, setHelping] = useState(false);
  const [helperName, setHelperName] = useState("");
  const [helperPhone, setHelperPhone] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [busy, setBusy] = useState(false);

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string | null> = {};
    if (mode === "signup" && !name.trim()) next.name = t("nameMissing");
    if (!normalisePhone(phone)) next.phone = t("phoneInvalid");
    if (mode === "signup" && helping && helperPhone && !normalisePhone(helperPhone)) next.helperPhone = t("helperPhoneInvalid");
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setBusy(true);
    await sendCode(normalisePhone(phone)!);
    setBusy(false);
    setStage("code");
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = toLatinDigits(code.replace(/\s/g, ""));
    const number = normalisePhone(phone)!;
    setBusy(true);
    const ok = await verifyCode(number, digits);
    setBusy(false);
    if (!ok) {
      setErrors({ code: t("codeInvalid") });
      return;
    }
    if (mode === "signup") {
      const helperNumber = helping ? normalisePhone(helperPhone) : null;
      saveLearner({
        name: name.trim(),
        phone: number,
        helper: helping && helperNumber ? { name: helperName.trim(), phone: helperNumber } : null,
      });
      const first = courses[0];
      router.push(`/courses/${first.id}/${first.lessons[0].id}`);
    } else {
      // Until there is a real account server, logging in on this computer keeps any details saved here.
      const known = data.learner?.phone === number ? data.learner : null;
      saveLearner(known ?? { name: "", phone: number, helper: null });
      router.push("/my-learning");
    }
  };

  if (stage === "code") {
    return (
      <form onSubmit={submitCode} noValidate className="mt-8 space-y-6">
        <h2>{t("codeTitle")}</h2>
        <p className="text-lg">{t("codeIntro", { phone: formatPhone(normalisePhone(phone)!) })}</p>
        {MOCK_OTP && <p className="max-w-md rounded-md border-2 border-dashed border-ink bg-marigold-wash p-4">{t("testNote")}</p>}
        <Field
          id="code"
          label={t("code")}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^\d০-৯]/g, ""))}
          error={errors.code}
          className="tracking-[0.4em]"
          autoFocus
        />
        <div className="flex flex-col items-start gap-3">
          <Button type="submit" disabled={busy} className="text-xl">
            {t("verify")}
          </Button>
          <button
            type="button"
            onClick={() => {
              setStage("details");
              setCode("");
              setErrors({});
            }}
            className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold text-green underline underline-offset-4"
          >
            {t("changeNumber")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submitDetails} noValidate className="mt-8 space-y-6">
      {mode === "signup" && (
        <Field
          id="name"
          label={t("name")}
          hint={t("nameHint")}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      )}
      <Field
        id="phone"
        label={t("phone")}
        hint={t("phoneHint")}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />

      {mode === "signup" && (
        <div className="max-w-md rounded-md border-2 border-ink bg-white p-4">
          <label className="flex min-h-[2.8rem] cursor-pointer items-center gap-4 text-lg font-bold">
            <input type="checkbox" checked={helping} onChange={(e) => setHelping(e.target.checked)} className="h-7 w-7 accent-[var(--color-green)]" />
            {t("helperToggle")}
          </label>
          {helping && (
            <div className="mt-4 space-y-5 border-t-2 border-line-soft pt-4">
              <p className="text-ink-soft">{t("helperHint")}</p>
              <Field id="helper-name" label={t("helperName")} value={helperName} onChange={(e) => setHelperName(e.target.value)} />
              <Field
                id="helper-phone"
                label={t("helperPhone")}
                type="tel"
                inputMode="tel"
                value={helperPhone}
                onChange={(e) => setHelperPhone(e.target.value)}
                error={errors.helperPhone}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col items-start gap-3 pt-2">
        <Button type="submit" disabled={busy} className="text-xl">
          {t("sendCode")}
        </Button>
        <TextLink href={mode === "signup" ? "/login" : "/signup"}>{mode === "signup" ? t("toLogin") : t("toSignup")}</TextLink>
      </div>
    </form>
  );
}

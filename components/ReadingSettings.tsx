"use client";

import { useTranslations } from "next-intl";
import { saveSettings, useAppData, type TextSize } from "@/lib/storage";

const sizes: TextSize[] = ["normal", "large", "xl"];

/** Text size, stronger colours and read-aloud. Used in the header pop-up and on the Settings page. */
export default function ReadingSettings() {
  const t = useTranslations("reading");
  const t2 = useTranslations("common");
  const { settings } = useAppData();

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-xl font-bold">{t("textSize")}</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {sizes.map((size, i) => (
            <label
              key={size}
              className="flex min-h-[2.8rem] cursor-pointer items-center gap-3 rounded-md border-2 border-ink bg-white px-4 has-[:checked]:bg-green has-[:checked]:text-white"
            >
              <input
                type="radio"
                name="text-size"
                value={size}
                checked={settings.textSize === size}
                onChange={() => saveSettings({ textSize: size })}
                className="h-5 w-5 accent-current"
              />
              <span className="font-bold" style={{ fontSize: `${1 + i * 0.2}rem` }}>
                {t(size)}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-ink-soft">{t("sample")}</p>
      </fieldset>

      <Toggle
        label={t("contrast")}
        help={t("contrastHelp")}
        checked={settings.highContrast}
        onChange={(v) => saveSettings({ highContrast: v })}
        on={t2("on")}
        off={t2("off")}
      />

      <Toggle
        label={t("readAloud")}
        help={t("readAloudHelp")}
        checked={settings.readAloud}
        onChange={(v) => saveSettings({ readAloud: v })}
        on={t2("on")}
        off={t2("off")}
      />

      <Toggle
        label={t("easyMouse")}
        help={t("easyMouseHelp")}
        checked={settings.easyMouse}
        onChange={(v) => saveSettings({ easyMouse: v })}
        on={t2("on")}
        off={t2("off")}
      />

      <p className="border-l-4 border-marigold pl-3 text-ink-soft">{t("remembered")}</p>
    </div>
  );
}

function Toggle({
  label,
  help,
  checked,
  onChange,
  on,
  off,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  on: string;
  off: string;
}) {
  return (
    <fieldset>
      <legend className="text-xl font-bold">{label}</legend>
      <p className="mt-1 text-ink-soft">{help}</p>
      <div className="mt-3 flex gap-3">
        {[true, false].map((value) => (
          <label
            key={String(value)}
            className="flex min-h-[2.8rem] min-w-[6rem] cursor-pointer items-center gap-3 rounded-md border-2 border-ink bg-white px-4 font-bold has-[:checked]:bg-green has-[:checked]:text-white"
          >
            <input
              type="radio"
              name={label}
              checked={checked === value}
              onChange={() => onChange(value)}
              className="h-5 w-5 accent-current"
            />
            {value ? on : off}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

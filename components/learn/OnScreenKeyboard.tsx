"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

type Props = {
  /** The key to press next: a letter, " ", "Backspace" or null. Uppercase letters also light up Shift. */
  next: string | null;
  onKey: (key: string) => void;
};

/**
 * A picture of the keyboard that lights up the key to press next.
 * Keys can be tapped too, which helps on a phone or tablet.
 */
export default function OnScreenKeyboard({ next, onKey }: Props) {
  const t = useTranslations("player");
  const [shifted, setShifted] = useState(false);
  const nextLower = next && next.length === 1 ? next.toLowerCase() : next;
  const needsShift = Boolean(next && next.length === 1 && next !== next.toLowerCase());

  const key = (label: string, value: string, wide = "") => {
    const glow = value === nextLower || (value === "Shift" && needsShift && !shifted);
    return (
      <button
        key={value}
        type="button"
        tabIndex={-1}
        onClick={() => {
          if (value === "Shift") return setShifted(!shifted);
          if (value.length === 1 && value !== " ") {
            onKey(shifted ? value.toUpperCase() : value);
            setShifted(false);
          } else onKey(value);
        }}
        className={`flex h-[2.6rem] min-w-0 flex-1 items-center justify-center rounded-sm border-2 text-lg font-bold ${wide} ${
          glow ? "border-ink bg-marigold text-ink" : value === "Shift" && shifted ? "border-ink bg-select" : "border-line-soft bg-white text-ink"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div role="group" aria-label={t("keyboardPicture")} className="no-print space-y-1.5 rounded-md border-2 border-ink bg-paper-deep p-2">
      <div className="flex gap-1">
        {ROWS[0].split("").map((c) => key(shifted ? c.toUpperCase() : c, c))}
        {key("←", "Backspace", "flex-[1.6]")}
      </div>
      <div className="flex gap-1 px-[3%]">
        {ROWS[1].split("").map((c) => key(shifted ? c.toUpperCase() : c, c))}
        {key("Enter", "Enter", "flex-[1.8]")}
      </div>
      <div className="flex gap-1">
        {key("Shift", "Shift", "flex-[1.8]")}
        {ROWS[2].split("").map((c) => key(shifted ? c.toUpperCase() : c, c))}
        <span className="flex-[1.8]" />
      </div>
      <div className="flex gap-1 px-[18%]">{key("Space", " ", "flex-[6]")}</div>
    </div>
  );
}

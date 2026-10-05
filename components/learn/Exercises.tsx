"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pick, type Exercise, type KeyName, type MousePart, type Picture, type Text } from "@/content/path";
import Icon from "../Icon";
import { FigureDrawing, PictureDrawing, isWideFigure } from "../illustrations/Drawings";
import { InteractiveKeyboard, InteractiveMouse } from "./InteractiveFigures";
import OnScreenKeyboard from "./OnScreenKeyboard";
import { ClickTask, DoubleClickTask, DragTask, KeyTask, ScrollTask } from "./Skills";

// One screen of a lesson, for each kind of exercise.
// "Checkable" kinds (choice, tap, order, type) report a value; the lesson
// player decides if it is right. "Self-finishing" kinds (match, do) call onDone.

type Of<K extends Exercise["kind"]> = Extract<Exercise, { kind: K }>;

export type Value = number | string | number[] | null;

const normalise = (s: string, caseSensitive?: boolean) => {
  const t = s.trim().replace(/\s+/g, " ");
  return caseSensitive ? t : t.toLowerCase();
};

export function isCorrect(ex: Exercise, value: Value, locale: string): boolean {
  switch (ex.kind) {
    case "choice":
      return typeof value === "number" && Boolean(ex.options[value]?.correct);
    case "tap":
      return value === ex.answer;
    case "order":
      return Array.isArray(value) && value.length === ex.steps.length && value.every((v, i) => v === i);
    case "type":
      if (typeof value !== "string") return false;
      if (!ex.answer) return value.replace(/\s/g, "").length >= 2;
      return normalise(value, ex.caseSensitive) === normalise(pick(ex.answer, locale), ex.caseSensitive);
    default:
      return true;
  }
}

/** A value is ready to be checked. */
export function hasAnswer(ex: Exercise, value: Value) {
  if (ex.kind === "order") return Array.isArray(value) && value.length === ex.steps.length;
  if (ex.kind === "type") return typeof value === "string" && value.trim().length > 0;
  return value !== null && value !== undefined;
}

/** A hint to show after a first wrong try (from the chosen option, if it has one). */
export function hintFor(ex: Exercise, value: Value, locale: string): string | null {
  if (ex.kind === "choice" && typeof value === "number") {
    const h = ex.options[value]?.hint;
    return h ? pick(h, locale) : null;
  }
  return null;
}

/** The text that the voice reads and the speech bubble shows. */
export function promptOf(ex: Exercise): Text {
  return ex.kind === "learn" ? ex.text : ex.prompt;
}

/** A plain description of the right answer, shown when revealing it. */
export function useAnswerText() {
  const t = useTranslations("player");
  const locale = useLocale();
  const pictureName = (p: Picture) => t(`pic${p[0].toUpperCase()}${p.slice(1)}` as "picMouse");
  return (ex: Exercise): string | string[] | null => {
    switch (ex.kind) {
      case "choice": {
        const o = ex.options.find((x) => x.correct);
        return o?.text ? pick(o.text, locale) : o?.picture ? pictureName(o.picture) : null;
      }
      case "tap":
        return ex.on === "mouse" ? t(ex.answer as MousePart) : ex.answer === "backspace" ? "Backspace" : ex.answer === "enter" ? "Enter" : ex.answer === "space" ? "Space" : "Shift";
      case "order":
        return ex.steps.map((s) => pick(s, locale));
      case "type":
        return ex.answer ? pick(ex.answer, locale) : null;
      default:
        return null;
    }
  };
}

// ---- Learn ----

export function LearnView({ ex }: { ex: Of<"learn"> }) {
  if (!ex.figure && !ex.picture) return null;
  return (
    <div
      className={`mx-auto text-ink ${
        (ex.figure && isWideFigure(ex.figure)) || ex.picture === "keyboard" ? "max-w-xl" : ex.picture ? "max-w-xs" : "max-w-[12rem]"
      }`}
    >
      {ex.figure ? <FigureDrawing figure={ex.figure} /> : ex.picture ? <PictureDrawing picture={ex.picture} className="w-full" /> : null}
    </div>
  );
}

// ---- Choice ----

export function ChoiceView({
  ex,
  value,
  onChange,
  disabled,
  reveal = false,
}: {
  ex: Of<"choice">;
  value: Value;
  onChange: (v: Value) => void;
  disabled: boolean;
  /** Show which answer was right. */
  reveal?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("player");
  const pictures = ex.options.every((o) => o.picture && !o.text);
  return (
    <div role="radiogroup" className={pictures ? "grid grid-cols-3 gap-3 sm:gap-5" : "grid gap-3"}>
      {ex.options.map((o, i) => {
        const selected = value === i;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(i)}
            className={`flex items-center gap-3 rounded-md border-2 text-lg font-bold ${
              pictures ? "aspect-square flex-col justify-center p-3" : "min-h-[3.4rem] w-full px-5 py-3 text-left"
            } ${
              reveal && o.correct
                ? "border-green bg-green-wash outline outline-4 outline-green"
                : selected
                  ? "border-ink bg-marigold-wash"
                  : "border-line-soft bg-white hover:border-ink"
            } disabled:cursor-default`}
          >
            {!pictures && (
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink ${selected ? "bg-ink" : "bg-white"}`}
              >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
              </span>
            )}
            {o.picture && (
              <>
                <PictureDrawing picture={o.picture} className="w-full" boxed decorative />
                <span className="sr-only">{t(`pic${o.picture[0].toUpperCase()}${o.picture.slice(1)}` as "picMouse")}</span>
              </>
            )}
            {o.text && pick(o.text, locale)}
          </button>
        );
      })}
    </div>
  );
}

// ---- Tap the picture ----

export function TapView({
  ex,
  value,
  onChange,
  disabled,
  highlight,
}: {
  ex: Of<"tap">;
  value: Value;
  onChange: (v: Value) => void;
  disabled: boolean;
  highlight: boolean;
}) {
  return ex.on === "mouse" ? (
    <InteractiveMouse
      selected={(value as MousePart | null) ?? null}
      onSelect={onChange}
      highlight={highlight ? (ex.answer as MousePart) : null}
      disabled={disabled}
    />
  ) : (
    <InteractiveKeyboard
      selected={(value as KeyName | null) ?? null}
      onSelect={onChange}
      highlight={highlight ? (ex.answer as KeyName) : null}
      disabled={disabled}
    />
  );
}

// ---- Match the pairs ----

/** Shuffle that is the same every time for the same seed (so server and browser agree). */
export function seededOrder(length: number, seed: string): number[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  // Never show the answer already in order.
  if (length > 1 && order.every((v, i) => v === i)) order.push(order.shift()!);
  return order;
}

export function MatchView({ ex, seed, onDone }: { ex: Of<"match">; seed: string; onDone: (mistakes: number) => void }) {
  const locale = useLocale();
  const t = useTranslations("player");
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [message, setMessage] = useState(false);
  const rightOrder = seededOrder(ex.pairs.length, seed);

  const tryPair = (l: number, r: number) => {
    if (l === r) {
      const next = [...matched, l];
      setMatched(next);
      setLeft(null);
      setMessage(false);
      if (next.length === ex.pairs.length) onDone(wrong);
    } else {
      setWrong(wrong + 1);
      setMessage(true);
      setLeft(null);
    }
  };

  const cell = (state: "matched" | "selected" | "idle") =>
    `flex min-h-[3.4rem] w-full items-center justify-center rounded-md border-2 px-3 py-2 text-center text-lg font-bold ${
      state === "matched"
        ? "border-green bg-green-wash text-green"
        : state === "selected"
          ? "border-ink bg-marigold-wash"
          : "border-line-soft bg-white hover:border-ink"
    }`;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <div className="space-y-3">
          {ex.pairs.map((p, i) => (
            <button
              key={i}
              type="button"
              lang="en"
              disabled={matched.includes(i)}
              aria-pressed={left === i}
              onClick={() => setLeft(i)}
              className={cell(matched.includes(i) ? "matched" : left === i ? "selected" : "idle")}
            >
              {matched.includes(i) && <Icon name="check" className="mr-2 h-5 w-5" />}
              {pick(p.left, locale)}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {rightOrder.map((i) => (
            <button
              key={i}
              type="button"
              disabled={matched.includes(i)}
              onClick={() => (left === null ? setMessage(false) : tryPair(left, i))}
              className={cell(matched.includes(i) ? "matched" : "idle")}
            >
              {pick(ex.pairs[i].right, locale)}
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="mt-4 min-h-[1.6em] text-lg">
        {message && t("matchWrong")}
      </p>
    </div>
  );
}

// ---- Put in order ----

export function OrderView({
  ex,
  seed,
  value,
  onChange,
  disabled,
}: {
  ex: Of<"order">;
  seed: string;
  value: Value;
  onChange: (v: Value) => void;
  disabled: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("player");
  const chosen = (value as number[] | null) ?? [];
  const pool = seededOrder(ex.steps.length, seed);
  return (
    <div className="space-y-5">
      <div>
        <p className="font-bold">{t("orderYours")}</p>
        <ol className="mt-2 min-h-[4rem] space-y-2 rounded-md border-2 border-dashed border-ink bg-white p-3">
          {chosen.length === 0 && <li className="text-ink-soft">{t("orderEmpty")}</li>}
          {chosen.map((i, n) => (
            <li key={i} className="max-w-none">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(chosen.filter((x) => x !== i))}
                className="flex min-h-[3rem] w-full items-center gap-3 rounded-md border-2 border-ink bg-marigold-wash px-4 py-2 text-left text-lg font-bold"
              >
                <span className="font-heading text-xl">{n + 1}.</span>
                {pick(ex.steps[i], locale)}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className="text-ink-soft">{t("orderHelp")}</p>
      <div className="grid gap-2">
        {pool
          .filter((i) => !chosen.includes(i))
          .map((i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange([...chosen, i])}
              className="flex min-h-[3rem] w-full items-center rounded-md border-2 border-line-soft bg-white px-4 py-2 text-left text-lg font-bold hover:border-ink"
            >
              {pick(ex.steps[i], locale)}
            </button>
          ))}
      </div>
    </div>
  );
}

// ---- Type ----

export function TypeView({
  ex,
  value,
  onChange,
  disabled,
}: {
  ex: Of<"type">;
  value: Value;
  onChange: (v: Value) => void;
  disabled: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("player");
  const text = (value as string | null) ?? "";
  const target = ex.answer ? pick(ex.answer, locale) : null;

  // Which key to press next: the next letter if all is right so far, else Backspace.
  let next: string | null = null;
  let wrong = false;
  if (target) {
    const sameSoFar = ex.caseSensitive ? target.startsWith(text) : target.toLowerCase().startsWith(text.toLowerCase());
    if (!sameSoFar) {
      next = "Backspace";
      wrong = true;
    } else if (text.length < target.length) next = target[text.length];
  }
  const keyName = (k: string) => (k === " " ? "Space" : k === "Backspace" ? "Backspace" : k);

  return (
    <div className="space-y-4">
      <label htmlFor="type-box" className="sr-only">
        {t("typeBox")}
      </label>
      <input
        id="type-box"
        value={text}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        lang="en"
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-2 border-ink bg-white px-4 py-3 font-body text-3xl tracking-wide"
      />
      <p aria-live="polite" className="min-h-[1.6em] text-lg font-bold">
        {wrong ? t("wrongLetter") : next ? t("nextKey", { key: keyName(next) }) : null}
      </p>
      {!disabled && (
        <OnScreenKeyboard
          next={next}
          onKey={(k) => {
            if (k === "Backspace") onChange(text.slice(0, -1));
            else if (k === "Enter") return;
            else onChange(text + k);
          }}
        />
      )}
    </div>
  );
}

// ---- Do it ----

export function DoView({
  ex,
  onDone,
  onHint,
  showMe,
}: {
  ex: Of<"do">;
  onDone: () => void;
  onHint: (s: string) => void;
  showMe: boolean;
}) {
  const props = { onDone, onHint, showMe };
  switch (ex.skill) {
    case "click":
      return <ClickTask {...props} />;
    case "doubleClick":
      return <DoubleClickTask {...props} />;
    case "drag":
      return <DragTask {...props} />;
    case "scroll":
      return <ScrollTask {...props} />;
    case "backspace":
    case "enter":
      return <KeyTask which={ex.skill} {...props} />;
  }
}

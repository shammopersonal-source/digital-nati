"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import PracticeShell from "./PracticeShell";

const SIZES = [11, 12, 14, 16, 18, 20, 24, 28];
const TARGET_SIZE = 16;

type Style = { bold?: boolean; italic?: boolean; underline?: boolean; size: number };
type Message = { kind: "success" | "hint"; text: string } | null;

const clean = (word: string) => word.replace(/[.,!?।]/g, "");

/**
 * A simplified copy of Word: choose a word by double-clicking, make it bold,
 * make it bigger, and save. Buttons sit where they do in the real Word.
 */
export default function WordPractice({ onDone }: { onDone: () => void }) {
  const t = useTranslations("word");
  const tp = useTranslations("practice");
  const lines = [t("line1"), t("line2"), t("line3")].map((l) => l.split(" "));
  const target = t("target");
  const targetKey = (() => {
    for (let l = 0; l < lines.length; l++) {
      const w = lines[l].findIndex((word) => clean(word) === target);
      if (w >= 0) return `${l}:${w}`;
    }
    return "1:0";
  })();

  const [selected, setSelected] = useState<string | null>(null);
  const [everSelected, setEverSelected] = useState(false);
  const [styles, setStyles] = useState<Record<string, Style>>({});
  const [saveOpen, setSaveOpen] = useState(false);
  const [fileName, setFileName] = useState(t("defaultName"));
  const [savedAs, setSavedAs] = useState<string | null>(null);
  const [message, setMessage] = useState<Message>(null);
  const clickTimer = useRef<number | undefined>(undefined);

  const styleOf = (key: string): Style => styles[key] ?? { size: 11 };
  const targetStyle = styleOf(targetKey);
  const conditions = [everSelected, Boolean(targetStyle.bold), targetStyle.size >= TARGET_SIZE, savedAs !== null];
  const task = conditions.findIndex((c) => !c);
  const done = task === -1;

  // Called after any action: say "well done" when a task was just completed.
  const check = (before: number, after: boolean[]) => {
    const nowTask = after.findIndex((c) => !c);
    if (nowTask === -1) onDone();
    if (nowTask === -1 || nowTask > before) setMessage({ kind: "success", text: tp("wellDone") });
  };

  const select = (key: string, word: string) => {
    setSelected(key);
    if (key === targetKey) {
      setEverSelected(true);
      check(task, [true, ...conditions.slice(1)]);
    } else {
      setMessage({ kind: "hint", text: t("selectHintWrong", { chosen: clean(word), word: target }) });
    }
  };

  const applyStyle = (patch: (s: Style) => Style) => {
    if (!selected) {
      setMessage({ kind: "hint", text: t("needSelection", { word: target }) });
      return;
    }
    const nextStyle = patch(styleOf(selected));
    setStyles({ ...styles, [selected]: nextStyle });
    if (selected === targetKey) {
      check(task, [everSelected, Boolean(nextStyle.bold), nextStyle.size >= TARGET_SIZE, savedAs !== null]);
    }
  };

  const bigger = () =>
    applyStyle((s) => ({ ...s, size: SIZES.find((n) => n > s.size) ?? s.size }));

  const tasks = [
    { title: t("selectTitle", { word: target }), help: t("selectHelp", { word: target }) },
    { title: t("boldTitle"), help: t("boldHelp") },
    { title: t("biggerTitle"), help: t("biggerHelp") },
    { title: t("saveTitle"), help: t("saveHelp") },
  ];
  const current = tasks[done ? 3 : task];
  const shownSize = selected ? styleOf(selected).size : 11;

  const ribbonBtn =
    "flex min-h-[2.8rem] min-w-[2.8rem] flex-col items-center justify-center rounded-sm border-2 border-transparent px-2 hover:border-ink hover:bg-paper";

  return (
    <PracticeShell
      task={done ? 3 : task}
      total={4}
      title={current.title}
      help={current.help}
      message={message}
      done={done}
      doneText={t("allDone")}
      onRestart={() => {
        setSelected(null);
        setEverSelected(false);
        setStyles({});
        setSavedAs(null);
        setFileName(t("defaultName"));
        setMessage(null);
      }}
    >
      <p className="mb-4 text-ink-soft">{t("simNote")}</p>

      <div className="overflow-hidden rounded-sm border-2 border-ink">
        {/* Title bar with the Save (disk) button at the top left, like the real Word. */}
        <div className="flex items-center gap-3 border-b-2 border-ink bg-paper-deep px-2 py-1">
          <button
            type="button"
            onClick={() => setSaveOpen(true)}
            className="flex min-h-[2.8rem] items-center gap-2 rounded-sm border-2 border-transparent px-2 font-bold hover:border-ink hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M4 4h13l3 3v13H4Z M8 4v5h8V4 M8 20v-6h8v6" />
            </svg>
            <span>{t("save")}</span>
          </button>
          <span className="flex-1 truncate text-center">{savedAs ? `${savedAs} - Word` : t("windowTitle")}</span>
        </div>

        {/* The ribbon. */}
        <div className="border-b-2 border-ink bg-white px-2 pb-2">
          <span className="inline-block border-b-4 border-green px-2 py-1 font-bold">{t("home")}</span>
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <label className="flex flex-col items-center">
              <select
                value={shownSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  applyStyle((s) => ({ ...s, size }));
                }}
                className="min-h-[2.8rem] rounded-sm border-2 border-ink bg-white px-2 text-lg"
              >
                {SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-small">{t("size")}</span>
            </label>
            <button type="button" onClick={bigger} className={ribbonBtn}>
              <span className="font-heading text-xl leading-none">A▲</span>
              <span className="text-small">{t("bigger")}</span>
            </button>
            <span className="mx-1 h-12 w-px bg-line-soft" aria-hidden="true" />
            <button
              type="button"
              aria-pressed={Boolean(selected && styleOf(selected).bold)}
              onClick={() => applyStyle((s) => ({ ...s, bold: !s.bold }))}
              className={`${ribbonBtn} aria-pressed:bg-paper-deep`}
            >
              <span className="font-heading text-2xl font-bold leading-none">B</span>
              <span className="text-small">{t("bold")}</span>
            </button>
            <button
              type="button"
                            aria-pressed={Boolean(selected && styleOf(selected).italic)}
              onClick={() => applyStyle((s) => ({ ...s, italic: !s.italic }))}
              className={`${ribbonBtn} aria-pressed:bg-paper-deep`}
            >
              <span className="font-heading text-2xl italic leading-none">I</span>
              <span className="text-small">{t("italic")}</span>
            </button>
            <button
              type="button"
                            aria-pressed={Boolean(selected && styleOf(selected).underline)}
              onClick={() => applyStyle((s) => ({ ...s, underline: !s.underline }))}
              className={`${ribbonBtn} aria-pressed:bg-paper-deep`}
            >
              <span className="font-heading text-2xl leading-none underline">U</span>
              <span className="text-small">{t("underline")}</span>
            </button>
          </div>
        </div>

        {/* The page. */}
        <div className="relative bg-paper-deep p-3 sm:p-6">
          <div className="mx-auto min-h-[12rem] max-w-xl bg-white p-5 sm:p-8">
            {lines.map((words, l) => (
              <p key={l} className="mb-3 leading-relaxed">
                {words.map((word, w) => {
                  const key = `${l}:${w}`;
                  const s = styleOf(key);
                  return (
                    <span key={key}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          if (e.detail === 1) {
                            window.clearTimeout(clickTimer.current);
                            clickTimer.current = window.setTimeout(() => {
                              if (selected !== key) setMessage({ kind: "hint", text: t("selectHintSingle") });
                            }, 650);
                          }
                        }}
                        onDoubleClick={() => {
                          window.clearTimeout(clickTimer.current);
                          select(key, word);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            select(key, word);
                          }
                        }}
                        className={`cursor-text select-none rounded-[2px] ${selected === key ? "bg-select" : "hover:bg-paper"}`}
                        style={{
                          fontWeight: s.bold ? 700 : 400,
                          fontStyle: s.italic ? "italic" : undefined,
                          textDecoration: s.underline ? "underline" : undefined,
                          fontSize: `${(s.size / 11) * 1}rem`,
                        }}
                      >
                        {word}
                      </span>{" "}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>

          {saveOpen && (
            <div
              role="dialog"
              aria-label={t("dialogTitle")}
              className="absolute inset-x-3 top-3 mx-auto max-w-md rounded-md border-2 border-ink bg-white p-4 sm:top-6"
            >
              <p className="text-xl font-bold">{t("dialogTitle")}</p>
              <label className="mt-3 block font-bold" htmlFor="word-file-name">
                {t("fileName")}
              </label>
              <input
                id="word-file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="mt-1 block w-full rounded-sm border-2 border-ink px-3 py-2 text-lg"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const name = fileName.trim() || t("defaultName");
                    setSavedAs(name);
                    setSaveOpen(false);
                    check(task, [...conditions.slice(0, 3), true]);
                    if (!done) setMessage({ kind: "success", text: t("savedAs", { name }) });
                  }}
                  className="inline-flex min-h-[2.8rem] items-center rounded-md border-2 border-green bg-green px-5 text-lg font-bold text-white"
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => setSaveOpen(false)}
                  className="inline-flex min-h-[2.8rem] items-center rounded-md border-2 border-ink bg-white px-5 text-lg font-bold"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PracticeShell>
  );
}

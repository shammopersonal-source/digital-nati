"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Icon from "../Icon";

type Props = {
  task: number;
  total: number;
  title: string;
  help: string;
  /** Shown after a task is done ("Well done!") or as a gentle hint. */
  message?: { kind: "success" | "hint"; text: string } | null;
  done: boolean;
  doneText: string;
  onRestart: () => void;
  children: ReactNode;
};

/** The frame around every "Try it" exercise: what to do, the practice area, and calm feedback. */
export default function PracticeShell({ task, total, title, help, message, done, doneText, onRestart, children }: Props) {
  const t = useTranslations("practice");
  return (
    <div className="rounded-md border-2 border-ink bg-white">
      <div className="border-b-2 border-ink bg-paper-deep px-5 py-4" aria-live="polite">
        {done ? (
          <p className="flex items-center gap-3 text-xl font-bold text-green">
            <Icon name="check" className="h-8 w-8" />
            {doneText}
          </p>
        ) : (
          <>
            <p className="font-bold text-ink-soft">{t("taskOf", { current: task + 1, total })}</p>
            <h3 className="mt-1">{title}</h3>
            <p className="mt-1 text-lg">{help}</p>
          </>
        )}
        {!done && message && (
          <p
            className={`mt-3 rounded-sm px-3 py-2 text-lg ${
              message.kind === "success" ? "bg-green-wash font-bold text-green" : "border-l-4 border-marigold bg-white"
            }`}
          >
            {message.kind === "success" && "✓ "}
            {message.text}
          </p>
        )}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {done && (
        <div className="border-t-2 border-ink px-5 py-3">
          <button
            type="button"
            onClick={onRestart}
            className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold text-green underline underline-offset-4"
          >
            {t("again")}
          </button>
        </div>
      )}
    </div>
  );
}

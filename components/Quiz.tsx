"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pick, type QuizQuestion } from "@/content/courses";
import { Button } from "./Button";
import Icon from "./Icon";

/** A few gentle questions. Wrong answers get a hint and another go — there is no failing. */
export default function Quiz({ questions, onFinish }: { questions: QuizQuestion[]; onFinish: () => void }) {
  const t = useTranslations("quiz");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = questions[index];
  const choice = picked !== null ? q.options[picked] : null;
  const solved = Boolean(choice?.correct);
  const last = index === questions.length - 1;

  return (
    <div>
      <p className="font-bold text-ink-soft">{t("questionOf", { current: index + 1, total: questions.length })}</p>
      <fieldset className="mt-2">
        <legend className="font-heading text-2xl">{pick(q.question, locale)}</legend>
        <div className="mt-5 grid gap-3">
          {q.options.map((option, i) => {
            const isPicked = picked === i;
            const state = isPicked ? (option.correct ? "right" : "wrong") : "idle";
            return (
              <button
                key={i}
                type="button"
                disabled={solved && !isPicked}
                aria-pressed={isPicked}
                onClick={() => !solved && setPicked(i)}
                className={`flex min-h-[3.2rem] w-full items-center gap-3 rounded-md border-2 px-5 py-3 text-left text-lg font-bold disabled:opacity-60 ${
                  state === "right"
                    ? "border-green bg-green text-white"
                    : state === "wrong"
                      ? "border-brick bg-brick-wash text-ink"
                      : "border-ink bg-white text-ink hover:bg-paper-deep"
                }`}
              >
                {state === "right" && <Icon name="check" />}
                {pick(option.text, locale)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-5">
        {choice && !choice.correct && (
          <p className="rounded-md border-l-4 border-brick bg-white p-4 text-lg">
            {choice.hint ? pick(choice.hint, locale) : t("tryAgain")}
          </p>
        )}
        {solved && (
          <div className="flex flex-col items-start gap-4">
            <p className="text-xl font-bold text-green">{t("correct")}</p>
            <Button
              onClick={() => {
                if (last) onFinish();
                else {
                  setIndex(index + 1);
                  setPicked(null);
                }
              }}
            >
              {last ? t("finish") : t("next")}
              <Icon name="arrowRight" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { dayKey, setDailyGoal, useAppData, useHydrated } from "@/lib/storage";

const DAY_KEYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as const;

/** This week's dates, Saturday to Friday (the Bangladeshi week). */
function thisWeek(today = new Date()) {
  const sinceSaturday = (today.getDay() + 1) % 7;
  return DAY_KEYS.map((name, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - sinceSaturday + i);
    return { name, key: dayKey(d), isToday: i === sinceSaturday };
  });
}

/**
 * Today's goal and the days learned this week. Gentle on purpose: no streak
 * that breaks, nothing lost for missing a day.
 */
export default function GoalSummary() {
  const t = useTranslations("goal");
  const { days, dailyGoal } = useAppData();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="min-h-[9rem]" />;

  const goal = dailyGoal ?? 5;
  const today = days[dayKey()] ?? 0;
  const week = thisWeek();
  const learnedDays = week.filter((d) => (days[d.key] ?? 0) > 0).length;
  const reached = today >= goal;

  return (
    <section aria-labelledby="goal-title" className="rounded-md border-2 border-ink bg-white p-5">
      <h2 id="goal-title" className="text-xl">
        {t("title")}
      </h2>
      <p className="mt-1 text-lg">{t("today", { minutes: today, goal })}</p>
      <div aria-hidden="true" className="mt-2 h-3 overflow-hidden rounded-sm border-2 border-ink bg-paper">
        <div className="h-full bg-green" style={{ width: `${Math.min(100, (today / goal) * 100)}%` }} />
      </div>
      <p className={`mt-2 ${reached ? "font-bold text-green" : "text-ink-soft"}`}>{reached ? `✓ ${t("reached")}` : today === 0 ? t("notYet") : null}</p>

      <p className="mt-4 font-bold">{t("week", { count: learnedDays })}</p>
      <ol aria-label={t("weekLabel")} className="mt-2 grid grid-cols-7 gap-1 text-center">
        {week.map((d) => {
          const learned = (days[d.key] ?? 0) > 0;
          return (
            <li key={d.key} className="flex max-w-none flex-col items-center gap-1">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                  learned ? "border-green bg-green text-white" : "border-line-soft bg-white"
                } ${d.isToday ? "outline outline-2 outline-offset-2 outline-ink" : ""}`}
              >
                {learned ? "✓" : ""}
              </span>
              <span className={`text-small ${d.isToday ? "font-bold" : ""}`}>{t(d.name)}</span>
              <span className="sr-only">{learned ? t("learned") : t("notLearned")}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Pick 5, 10 or 15 minutes a day. */
export function GoalChooser({ onChosen }: { onChosen?: () => void }) {
  const t = useTranslations("goal");
  const { dailyGoal } = useAppData();
  return (
    <fieldset>
      <legend className="text-xl font-bold">{t("choose")}</legend>
      <p className="text-ink-soft">{t("chooseHelp")}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {([5, 10, 15] as const).map((n) => (
          <label
            key={n}
            className="flex min-h-[2.8rem] cursor-pointer items-center gap-3 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold has-[:checked]:bg-green has-[:checked]:text-white"
          >
            <input
              type="radio"
              name="daily-goal"
              checked={dailyGoal === n}
              onChange={() => {
                setDailyGoal(n);
                onChosen?.();
              }}
              className="h-5 w-5 accent-current"
            />
            {t("option", { count: n })}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

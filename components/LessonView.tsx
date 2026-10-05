"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getCourse, isReady, pick, type Practice } from "@/content/courses";
import { completeLesson, markVisited, useAppData } from "@/lib/storage";
import { phones } from "@/lib/site";
import { Button, ButtonLink, TextLink } from "./Button";
import Icon from "./Icon";
import RichText, { usePlainText } from "./RichText";
import ReadAloud from "./ReadAloud";
import Quiz from "./Quiz";
import VideoPlayer from "./VideoPlayer";
import { FigureDrawing, isWideFigure } from "./illustrations/Drawings";
import MousePractice from "./practice/MousePractice";
import KeyboardPractice from "./practice/KeyboardPractice";
import ShutdownPractice from "./practice/ShutdownPractice";
import WordPractice from "./practice/WordPractice";

const STEPS = ["watch", "read", "try", "check"] as const;

const practices: Record<Practice, (p: { onDone: () => void }) => ReactNode> = {
  mouse: MousePractice,
  keyboard: KeyboardPractice,
  shutdown: ShutdownPractice,
  word: WordPractice,
};

/** Every lesson looks the same: Watch → Read → Try it → Check, one step at a time. */
export default function LessonView({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const t = useTranslations("lesson");
  const tc = useTranslations("common");
  const locale = useLocale();
  const plain = usePlainText();
  const data = useAppData();

  const course = getCourse(courseId)!;
  const index = course.lessons.findIndex((l) => l.id === lessonId);
  const lesson = course.lessons[index];
  const content = lesson.content!;
  const nextLesson = course.lessons[index + 1];

  const [step, setStep] = useState(0);
  const [practised, setPractised] = useState(false);
  const [finished, setFinished] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    markVisited(courseId, lessonId);
  }, [courseId, lessonId]);

  // When the step changes, bring the learner back to the top of the step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [step, finished]);

  const finish = () => {
    completeLesson(
      courseId,
      lessonId,
      course.lessons.map((l) => l.id),
    );
    setFinished(true);
  };

  const courseFinished = Boolean(data.progress[courseId]?.finishedAt);
  const stepName = (i: number) => t(STEPS[i]);
  const PracticeComponent = practices[content.practice];
  const readText = [plain(pick(content.summary, locale)), ...content.steps.map((s, i) => `${i + 1}. ${plain(pick(s.text, locale))}`)].join("\n");

  return (
    <div className="mx-auto max-w-page px-5 py-8">
      <p className="no-print font-bold text-ink-soft">{tc("lessonOf", { current: index + 1, total: course.lessons.length })}</p>
      <h1 className="mt-1">{pick(lesson.title, locale)}</h1>
      <p className="mt-3 text-lg">
        <RichText text={pick(content.summary, locale)} />
      </p>

      {/* Step indicator: where you are, in words, and you can go back to any step. */}
      <nav aria-label={t("stepsLabel")} className="no-print mt-8">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STEPS.map((s, i) => {
            const current = i === step && !finished;
            const past = i < step || finished;
            return (
              <li key={s} className="max-w-none">
                <button
                  type="button"
                  aria-current={current ? "step" : undefined}
                  onClick={() => {
                    setFinished(false);
                    setStep(i);
                  }}
                  className={`flex min-h-[3.2rem] w-full items-center gap-2 rounded-md border-2 px-3 text-left text-lg ${
                    current
                      ? "border-ink bg-marigold-wash font-bold"
                      : "border-line-soft bg-white text-ink hover:border-ink"
                  }`}
                >
                  <span className="font-heading">{i + 1}.</span>
                  {stepName(i)}
                  {past && <Icon name="check" className="ml-auto h-5 w-5 text-green" />}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="no-print mt-8" aria-labelledby="step-heading">
        <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="scroll-mt-6 outline-none">
          {finished ? t("finishedTitle") : t("stepOf", { current: step + 1, total: STEPS.length, name: stepName(step) })}
        </h2>

        {finished ? (
          <div className="mt-4 rounded-md border-2 border-green bg-green-wash p-6">
            <p className="text-lg">{t("finishedText")}</p>
            <div className="mt-6 flex flex-col items-start gap-3">
              {nextLesson && isReady(nextLesson) ? (
                <ButtonLink href={`/courses/${courseId}/${nextLesson.id}`} className="text-xl">
                  {t("nextLesson", { lesson: pick(nextLesson.title, locale) })}
                </ButtonLink>
              ) : courseFinished ? (
                <>
                  <p className="text-lg font-bold">{t("lastLesson")}</p>
                  <ButtonLink href={`/certificate/${courseId}`} className="text-xl">
                    {t("certificate")}
                  </ButtonLink>
                </>
              ) : nextLesson ? (
                <p className="text-lg">{t("nextComingSoon", { lesson: pick(nextLesson.title, locale) })}</p>
              ) : null}
              <TextLink href={`/courses/${courseId}`}>{t("backToCourse")}</TextLink>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-link inline-flex min-h-[2.8rem] items-center gap-2 text-lg font-bold text-green underline underline-offset-4"
              >
                <Icon name="print" />
                {t("print")}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {step === 0 && (
              <>
                <p className="mb-5 text-lg">{t("watchIntro")}</p>
                <VideoPlayer src={content.video?.src} poster={content.video?.poster} captions={content.video?.captions} />
              </>
            )}

            {step === 1 && (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-lg">{t("readIntro")}</p>
                  <ReadAloud text={readText} />
                </div>
                <ol className="space-y-0 border-t-2 border-ink">
                  {content.steps.map((s, i) => (
                    <li
                      key={i}
                      className={`grid max-w-none gap-5 border-b-2 border-line-soft py-6 ${
                        s.figure || s.image ? (s.figure && isWideFigure(s.figure) ? "md:grid-cols-[1fr_1.3fr]" : "md:grid-cols-[1.6fr_1fr]") : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <span className="font-heading text-3xl leading-none text-green">{i + 1}.</span>
                        <p className="text-lg">
                          <RichText text={pick(s.text, locale)} />
                        </p>
                      </div>
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image.src} alt={pick(s.image.alt, locale)} loading="lazy" className="w-full rounded-sm border-2 border-ink" />
                      ) : s.figure ? (
                        <div className={`text-ink ${isWideFigure(s.figure) ? "w-full" : "mx-auto w-40"}`}>
                          <FigureDrawing figure={s.figure} />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
                {content.tip && (
                  <aside className="mt-6 rounded-md border-2 border-ink bg-marigold-wash p-5">
                    <p className="font-bold">{t("tip")}</p>
                    <p className="mt-1 text-lg">
                      <RichText text={pick(content.tip, locale)} />
                    </p>
                  </aside>
                )}
                <Button variant="secondary" onClick={() => window.print()} className="mt-6">
                  <Icon name="print" />
                  {t("print")}
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="mb-5 text-lg">{t("tryIntro")}</p>
                <PracticeComponent onDone={() => setPractised(true)} />
              </>
            )}

            {step === 3 && (
              <>
                <p className="mb-5 text-lg">{t("checkIntro")}</p>
                <Quiz questions={content.quiz} onFinish={finish} />
              </>
            )}

            {/* Moving between steps. The next step is the main button, except while practising. */}
            {step < 3 && (
              <div className="mt-10 flex flex-col-reverse items-start gap-3 border-t-2 border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-link inline-flex min-h-[2.8rem] items-center gap-2 text-lg font-bold text-green underline underline-offset-4"
                  >
                    <Icon name="arrowLeft" />
                    {t("previous", { step: stepName(step - 1) })}
                  </button>
                ) : (
                  <span />
                )}
                <Button
                  variant={step === 2 && !practised ? "secondary" : "primary"}
                  onClick={() => setStep(step + 1)}
                  className="text-xl"
                >
                  {step === 2 && !practised ? t("skipPractice") : t("next", { step: stepName(step + 1) })}
                  <Icon name="arrowRight" />
                </Button>
              </div>
            )}
            {step === 3 && (
              <div className="mt-10 border-t-2 border-ink pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-link inline-flex min-h-[2.8rem] items-center gap-2 text-lg font-bold text-green underline underline-offset-4"
                >
                  <Icon name="arrowLeft" />
                  {t("previous", { step: stepName(2) })}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Printed recap: a clean A4 page of the steps to keep beside the computer. */}
      <section className="print-only">
        <p className="mt-4 font-bold">{t("recapTitle")}</p>
        <ol className="mt-3 list-decimal space-y-3 pl-6">
          {content.steps.map((s, i) => (
            <li key={i}>{plain(pick(s.text, locale))}</li>
          ))}
        </ol>
        {content.tip && (
          <p className="mt-4 border-l-4 border-ink pl-3">
            <strong>{t("tip")}:</strong> {plain(pick(content.tip, locale))}
          </p>
        )}
        <p className="mt-8 border-t pt-3">{t("printedFrom", { phones: phones.map((p) => p.display).join(", ") })}</p>
      </section>
    </div>
  );
}

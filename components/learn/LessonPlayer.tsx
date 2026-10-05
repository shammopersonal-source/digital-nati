"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { chapters, getChapter, isReady, pick, type Exercise } from "@/content/path";
import { addMinutes, completeLesson, markVisited, recordMistakes, useAppData } from "@/lib/storage";
import { speak, stopSpeaking } from "@/lib/speech";
import { usePlainText } from "../RichText";
import RichText from "../RichText";
import Dialog from "../Dialog";
import HelpButton from "../HelpButton";
import Icon from "../Icon";
import { Button, ButtonLink, TextLink } from "../Button";
import { Nati, type NatiMood } from "../illustrations/Drawings";
import GoalSummary from "./GoalSummary";
import {
  ChoiceView,
  DoView,
  hasAnswer,
  hintFor,
  isCorrect,
  LearnView,
  MatchView,
  OrderView,
  promptOf,
  TapView,
  TypeView,
  useAnswerText,
  type Value,
} from "./Exercises";

export type Item = { key: string; ex: Exercise };

type Props = {
  items: Item[];
  /** Lesson mode: progress is saved and the next lesson offered. */
  lesson?: { chapterId: string; lessonId: string };
  title: string;
  exitHref: "/learn" | "/practice";
};

type Status = "answering" | "retry" | "revealed" | "right";

/**
 * Plays a lesson (or a brush-up), one small screen at a time:
 * Nati says what to do, the learner answers, and kind feedback slides up.
 */
export default function LessonPlayer({ items: initial, lesson, title, exitHref }: Props) {
  const t = useTranslations("player");
  const tr = useTranslations("review");
  const locale = useLocale();
  const plain = usePlainText();
  const answerText = useAnswerText();
  const router = useRouter();
  const data = useAppData();

  const [queue, setQueue] = useState<Item[]>(initial);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<Value>(null);
  const [status, setStatus] = useState<Status>("answering");
  const [hint, setHint] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showMe, setShowMe] = useState(false);
  const [rightCount, setRightCount] = useState(0);
  const [finished, setFinished] = useState<{ minutes: number; tasks: number } | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [noVoice, setNoVoice] = useState(false);
  const missed = useRef(new Set<string>());
  const requeued = useRef(new Set<string>());
  const started = useRef(0);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const item = queue[index];
  const ex = item?.ex;
  const voiceText = ex ? plain(pick(promptOf(ex), locale)) : "";
  const audio = ex?.audio?.[locale as "bn" | "en"];

  useEffect(() => {
    started.current = Date.now();
    if (lesson) markVisited(lesson.chapterId, lesson.lessonId);
  }, [lesson]);

  // A new screen: move focus to what Nati says, and read it aloud if the learner asked for that.
  useEffect(() => {
    if (!ex) return;
    bubbleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    if (data.settings.readAloud) void speak(voiceText, locale, audio).then((ok) => setNoVoice(!ok));
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, queue.length]);

  const resetScreen = () => {
    setValue(null);
    setStatus("answering");
    setHint(null);
    setHintCount(0);
    setShowMe(false);
  };

  const finish = () => {
    stopSpeaking();
    const minutes = Math.min(30, Math.max(1, Math.round((Date.now() - started.current) / 60000)));
    addMinutes(minutes);
    const keys = initial.map((i) => i.key);
    const wrong = [...missed.current];
    recordMistakes(wrong, lesson ? [] : keys.filter((k) => !missed.current.has(k)));
    if (lesson) {
      const chapter = getChapter(lesson.chapterId)!;
      completeLesson(lesson.chapterId, lesson.lessonId, chapter.lessons.map((l) => l.id));
    }
    setFinished({ minutes, tasks: initial.filter((i) => i.ex.kind !== "learn").length });
  };

  const next = () => {
    if (index + 1 >= queue.length) return finish();
    setIndex(index + 1);
    resetScreen();
  };

  const markRight = () => {
    setStatus("right");
    setRightCount(rightCount + 1);
  };

  const check = () => {
    if (!ex) return;
    if (isCorrect(ex, value, locale)) return markRight();
    missed.current.add(item.key);
    if (status === "answering") {
      setStatus("retry");
      setHint(hintFor(ex, value, locale));
      if (ex.kind === "tap") setShowMe(false);
      return;
    }
    setStatus("revealed");
    setShowMe(true);
    if (!requeued.current.has(item.key)) {
      requeued.current.add(item.key);
      setQueue([...queue, item]);
    }
  };

  const onDoHint = (text: string) => {
    setHint(text);
    const n = hintCount + 1;
    setHintCount(n);
    // After two tips, show the learner how.
    if (n >= 2) setShowMe(true);
  };

  if (finished) {
    return (
      <Finished
        lesson={lesson}
        title={lesson ? t("doneTitle") : tr("doneTitle")}
        stats={t("doneStats", { count: finished.tasks, minutes: finished.minutes })}
        exitHref={exitHref}
      />
    );
  }

  if (!ex) return null;

  const checkable = ex.kind === "choice" || ex.kind === "tap" || ex.kind === "order" || ex.kind === "type";
  const locked = status === "right" || status === "revealed";
  const mood: NatiMood = status === "right" ? "happy" : status === "retry" || status === "revealed" ? "gentle" : "talk";
  const earlierUndone =
    lesson && index === 0
      ? chapters
          .flatMap((c) => c.lessons.map((l) => ({ c, l })))
          .slice(
            0,
            chapters.flatMap((c) => c.lessons.map((l) => `${c.id}/${l.id}`)).indexOf(`${lesson.chapterId}/${lesson.lessonId}`),
          )
          .some(({ c, l }) => isReady(l) && !data.progress[c.id]?.completed.includes(l.id))
      : false;
  const answer = status === "revealed" ? answerText(ex) : null;
  const rightKey = (["right1", "right2", "right3", "right4"] as const)[rightCount % 4];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar: stop, how far, help. */}
      <div className="border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setExitOpen(true)}
            className="inline-flex min-h-[2.8rem] items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep"
          >
            <Icon name="close" className="h-5 w-5" />
            {t("exit")}
          </button>
          <div className="order-last flex basis-full items-center gap-3 sm:order-none sm:flex-1 sm:basis-auto">
            <div
              role="progressbar"
              aria-label={t("progressLabel")}
              aria-valuemin={0}
              aria-valuemax={queue.length}
              aria-valuenow={index}
              className="h-4 flex-1 overflow-hidden rounded-sm border-2 border-ink bg-white"
            >
              <div className="h-full bg-green" style={{ width: `${(index / queue.length) * 100}%` }} />
            </div>
            <span className="shrink-0 font-bold">{t("progress", { current: index + 1, total: queue.length })}</span>
          </div>
          <HelpButton inline />
        </div>
        <p className="max-w-none border-t border-line-soft bg-marigold-wash px-4 py-1.5 text-center">{t("practiceStripe")}</p>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-[16rem] pt-6">
        <h1 className="sr-only">{title}</h1>
        {earlierUndone && <p className="mb-5 rounded-md border-2 border-dashed border-ink bg-white p-4">{t("skipAhead")}</p>}

        {/* Nati says what to do. */}
        <div className="flex items-start gap-3 sm:gap-5">
          <Nati mood={mood} className="w-12 shrink-0 text-ink sm:w-24" />
          <div
            ref={bubbleRef}
            tabIndex={-1}
            className="relative flex-1 rounded-md border-2 border-ink bg-white p-4 outline-none sm:p-5"
          >
            <span aria-hidden="true" className="absolute -left-[11px] top-6 h-5 w-5 rotate-45 border-b-2 border-l-2 border-ink bg-white" />
            {ex.kind === "learn" && <p className="mb-1 font-bold text-green">{t("newThing")}</p>}
            <p className="font-heading text-xl leading-snug sm:text-2xl">
              <RichText text={pick(promptOf(ex), locale)} />
            </p>
            <button
              type="button"
              onClick={() => void speak(voiceText, locale, audio).then((ok) => setNoVoice(!ok))}
              className="mt-3 inline-flex min-h-[2.8rem] items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep"
            >
              <Icon name="speaker" />
              {t("listen")}
            </button>
            {noVoice && <p className="mt-2 rounded-sm bg-marigold-wash p-3">{t("noVoice")}</p>}
          </div>
        </div>

        {/* The exercise itself. */}
        <div className="mt-8" key={`${index}-${item.key}`}>
          {ex.kind === "learn" && <LearnView ex={ex} />}
          {ex.kind === "choice" && <ChoiceView ex={ex} value={value} onChange={setValue} disabled={locked} reveal={status === "revealed"} />}
          {ex.kind === "tap" && <TapView ex={ex} value={value} onChange={setValue} disabled={locked} highlight={showMe} />}
          {ex.kind === "order" && <OrderView ex={ex} seed={item.key} value={value} onChange={setValue} disabled={locked} />}
          {ex.kind === "type" && <TypeView ex={ex} value={value} onChange={setValue} disabled={locked} />}
          {ex.kind === "match" && (
            <MatchView
              ex={ex}
              seed={item.key}
              onDone={(mistakes) => {
                if (mistakes > 0) missed.current.add(item.key);
                markRight();
              }}
            />
          )}
          {ex.kind === "do" && status !== "right" && <DoView ex={ex} onDone={markRight} onHint={onDoHint} showMe={showMe} />}
        </div>
      </div>

      {/* Bottom bar: the main button, and kind feedback. */}
      <div
        aria-live="polite"
        className={`fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink ${
          status === "right" ? "bg-green-wash" : status === "answering" ? "bg-paper" : "bg-paper-deep"
        }`}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            {status !== "answering" && <Nati mood={mood} className="hidden w-14 shrink-0 text-ink sm:block" />}
            <div>
              {status === "right" && <p className="text-2xl font-bold text-green">✓ {t(rightKey)}</p>}
              {status === "retry" && (
                <>
                  <p className="text-xl font-bold">{t("almost")}</p>
                  {hint && <p className="mt-1 text-lg">{hint}</p>}
                </>
              )}
              {status === "revealed" && (
                <>
                  <p className="text-lg font-bold">{t("answerWas")}</p>
                  {Array.isArray(answer) ? (
                    <ol className="list-decimal pl-6 text-lg">
                      {answer.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ol>
                  ) : (
                    answer && <p className="text-xl font-bold text-green">{answer}</p>
                  )}
                  {"explain" in ex && ex.explain && <p className="mt-1 text-lg">{pick(ex.explain, locale)}</p>}
                  <p className="mt-1 text-ink-soft">{t("comesBack")}</p>
                </>
              )}
              {status === "answering" && hint && <p className="text-lg">{hint}</p>}
              {status === "answering" && (ex.kind === "tap" || ex.kind === "do") && (
                <div className="flex flex-wrap gap-x-5">
                  <button
                    type="button"
                    onClick={() => setShowMe(true)}
                    className="text-link inline-flex min-h-[2.8rem] items-center gap-2 text-lg font-bold text-green underline underline-offset-4"
                  >
                    <Icon name="question" />
                    {t("showMe")}
                  </button>
                  {ex.kind === "do" && (
                    <button
                      type="button"
                      onClick={next}
                      className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold text-green underline underline-offset-4"
                    >
                      {t("skip")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {status === "right" && (
              <Button onClick={next} className="w-full text-xl sm:w-auto">
                {t("continue")}
                <Icon name="arrowRight" />
              </Button>
            )}
            {status === "revealed" && (
              <Button onClick={next} className="w-full text-xl sm:w-auto">
                {t("understood")}
              </Button>
            )}
            {(status === "answering" || status === "retry") && ex.kind === "learn" && (
              <Button onClick={next} className="w-full text-xl sm:w-auto">
                {t("continue")}
                <Icon name="arrowRight" />
              </Button>
            )}
            {(status === "answering" || status === "retry") && checkable && (
              <Button onClick={check} disabled={!hasAnswer(ex, value)} className="w-full text-xl sm:w-auto">
                {t("check")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={exitOpen} onClose={() => setExitOpen(false)} title={t("exitTitle")}>
        <p className="text-lg">{t("exitText")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setExitOpen(false)}>{t("exitNo")}</Button>
          <Button
            variant="secondary"
            onClick={() => {
              stopSpeaking();
              router.push(exitHref);
            }}
          >
            {t("exitYes")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function Finished({
  lesson,
  title,
  stats,
  exitHref,
}: {
  lesson?: { chapterId: string; lessonId: string };
  title: string;
  stats: string;
  exitHref: "/learn" | "/practice";
}) {
  const t = useTranslations("player");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const data = useAppData();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  const chapter = lesson ? getChapter(lesson.chapterId) : null;
  const chapterDone = Boolean(chapter && data.progress[chapter.id]?.finishedAt);
  // The next lesson on the path that is ready.
  const flat = chapters.flatMap((c) => c.lessons.map((l) => ({ c, l })));
  const here = lesson ? flat.findIndex(({ c, l }) => c.id === lesson.chapterId && l.id === lesson.lessonId) : -1;
  const nextUp = here >= 0 ? flat.slice(here + 1).find(({ l }) => isReady(l)) : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 text-center">
        <Nati mood="happy" className="mx-auto w-36 text-ink" />
        <h1 ref={headingRef} tabIndex={-1} className="mt-6 outline-none">
          {title}
        </h1>
        <p className="mt-3 text-lg">{stats}</p>
        {chapterDone && chapter && (
          <p className="mx-auto mt-6 max-w-md rounded-md border-2 border-green bg-green-wash p-4 text-xl font-bold">
            {t("chapterDone", { chapter: pick(chapter.title, locale) })}
          </p>
        )}

        <div className="mx-auto mt-8 max-w-md text-left">
          <GoalSummary />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          {chapterDone && chapter ? (
            <ButtonLink href={`/certificate/${chapter.id}`} className="text-xl">
              {t("certificate")}
            </ButtonLink>
          ) : nextUp && lesson ? (
            <ButtonLink href={`/learn/${nextUp.c.id}/${nextUp.l.id}`} className="text-xl">
              {t("next", { lesson: pick(nextUp.l.title, locale) })}
              <Icon name="arrowRight" />
            </ButtonLink>
          ) : null}
          {chapterDone && nextUp && (
            <TextLink href={`/learn/${nextUp.c.id}/${nextUp.l.id}`}>{t("next", { lesson: pick(nextUp.l.title, locale) })}</TextLink>
          )}
          <TextLink href={exitHref}>{exitHref === "/learn" ? t("backToPath") : tn("practice")}</TextLink>
          {!lesson && <TextLink href="/learn">{t("backToPath")}</TextLink>}
        </div>
      </div>
      <div className="no-print mx-auto mb-6">
        <Link href="/" className="text-link inline-flex min-h-[2.8rem] items-center text-lg">
          {tn("home")}
        </Link>
      </div>
    </div>
  );
}

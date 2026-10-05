"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useTranslations } from "next-intl";
import PracticeShell from "./PracticeShell";
import { Basket, Flower, Folder, Mango } from "../illustrations/Drawings";

// Circles start big and get a little smaller each time.
const circles = [
  { size: "7rem", left: "18%", top: "18%" },
  { size: "5.5rem", left: "62%", top: "45%" },
  { size: "4.5rem", left: "34%", top: "56%" },
];

type Message = { kind: "success" | "hint"; text: string } | null;

/** Click, double-click, drag and scroll — four small tasks with no wrong answers, only hints. */
export default function MousePractice({ onDone }: { onDone: () => void }) {
  const t = useTranslations("mouse");
  const tp = useTranslations("practice");
  const [task, setTask] = useState(0);
  const [message, setMessage] = useState<Message>(null);
  const [round, setRound] = useState(0);

  const next = () => {
    setMessage({ kind: "success", text: tp("wellDone") });
    if (task === 3) onDone();
    setTask(task + 1);
  };
  const hint = (text: string) => setMessage({ kind: "hint", text });

  const tasks = [
    { title: t("clickTitle"), help: t("clickHelp") },
    { title: t("dblTitle"), help: t("dblHelp") },
    { title: t("dragTitle"), help: t("dragHelp") },
    { title: t("scrollTitle"), help: t("scrollHelp") },
  ];
  const current = tasks[Math.min(task, 3)];

  return (
    <PracticeShell
      task={task}
      total={4}
      title={current.title}
      help={current.help}
      message={message}
      done={task > 3}
      doneText={t("allDone")}
      onRestart={() => {
        setTask(0);
        setMessage(null);
        setRound(round + 1);
      }}
    >
      <div key={`${task}-${round}`}>
        {task === 0 && <ClickTask onDone={next} />}
        {task === 1 && <DoubleClickTask onDone={next} onHint={hint} />}
        {task === 2 && <DragTask onDone={next} onHint={hint} />}
        {task === 3 && <ScrollTask onDone={next} />}
        {task > 3 && (
          <div className="flex h-56 items-center justify-center">
            <Flower className="h-48 text-ink" />
          </div>
        )}
      </div>
    </PracticeShell>
  );
}

function ClickTask({ onDone }: { onDone: () => void }) {
  const t = useTranslations("mouse");
  const [i, setI] = useState(0);
  const c = circles[i];
  return (
    <div className="relative h-[16rem] rounded-sm bg-paper">
      <p className="absolute right-3 top-2 font-bold text-ink-soft">{t("clickLeft", { count: circles.length - i })}</p>
      <button
        type="button"
        aria-label={t("circle")}
        onClick={() => (i === circles.length - 1 ? onDone() : setI(i + 1))}
        className="absolute rounded-full border-4 border-green-dark bg-green hover:bg-green-dark"
        style={{ width: c.size, height: c.size, left: c.left, top: c.top }}
      />
    </div>
  );
}

function DoubleClickTask({ onDone, onHint }: { onDone: () => void; onHint: (s: string) => void }) {
  const t = useTranslations("mouse");
  const timer = useRef<number | undefined>(undefined);
  return (
    <div className="flex h-[16rem] items-center justify-center rounded-sm bg-paper">
      <button
        type="button"
        onClick={(e) => {
          // Keyboard users press Enter: that counts as opening.
          if (e.detail === 0) return onDone();
          if (e.detail === 1) {
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => onHint(t("dblHint")), 650);
          }
        }}
        onDoubleClick={() => {
          window.clearTimeout(timer.current);
          onDone();
        }}
        className="flex flex-col items-center gap-2 rounded-md p-3 hover:bg-select focus-visible:bg-select"
      >
        <Folder className="h-28 w-36 text-ink" />
        <span className="text-lg font-bold">{t("folder")}</span>
      </button>
    </div>
  );
}

function DragTask({ onDone, onHint }: { onDone: () => void; onHint: (s: string) => void }) {
  const t = useTranslations("mouse");
  const basketRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    setDragging(true);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!start.current) return;
    setOffset({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    const basket = basketRef.current?.getBoundingClientRect();
    const inBasket =
      basket &&
      e.clientX >= basket.left - 10 &&
      e.clientX <= basket.right + 10 &&
      e.clientY >= basket.top - 30 &&
      e.clientY <= basket.bottom + 10;
    if (inBasket) return onDone();
    const moved = Math.abs(offset.x) + Math.abs(offset.y) > 12;
    setOffset({ x: 0, y: 0 });
    onHint(moved ? t("dragHint") : t("dragHelp"));
  };

  return (
    <div>
      <div className="relative h-[16rem] select-none overflow-hidden rounded-sm bg-paper">
        <div ref={basketRef} className="absolute bottom-3 right-[6%] flex flex-col items-center">
          <Basket className="h-28 w-40 text-ink" />
          <span className="font-bold">{t("basket")}</span>
        </div>
        <button
          type="button"
          aria-label={t("mango")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            start.current = null;
            setDragging(false);
            setOffset({ x: 0, y: 0 });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDone();
            }
          }}
          className={`absolute left-[8%] top-[18%] z-10 touch-none rounded-full p-1 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          <Mango className="pointer-events-none h-24 w-24 text-ink" />
        </button>
      </div>
      <p className="mt-3 text-ink-soft">{t("dragKeyboard")}</p>
    </div>
  );
}

function ScrollTask({ onDone }: { onDone: () => void }) {
  const t = useTranslations("mouse");
  const found = useRef(false);
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={t("scrollBox")}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (!found.current && el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
          found.current = true;
          onDone();
        }
      }}
      className="h-[16rem] overflow-y-auto rounded-sm border-2 border-ink bg-paper px-5"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <p key={i} className="flex h-[10rem] items-center text-xl text-ink-soft">
          {t("keepGoing")} ↓
        </p>
      ))}
      <div className="flex flex-col items-center pb-6">
        <Flower className="h-40 text-ink" />
        <p className="text-xl font-bold">{t("flowerFound")}</p>
      </div>
    </div>
  );
}

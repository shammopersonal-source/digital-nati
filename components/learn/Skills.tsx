"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useTranslations } from "next-intl";
import { useAppData } from "@/lib/storage";
import { Basket, FigureDrawing, Flower, Folder, Mango } from "../illustrations/Drawings";

// Small hands-on tasks: click, double-click, drag, scroll, Backspace and Enter.
// Used in lessons and in free practice. Each calls onDone when finished and
// onHint with a gentle tip when something didn't quite work.

type TaskProps = {
  onDone: () => void;
  onHint?: (text: string) => void;
  /** "Show me": draw a ring and arrow around what to do. */
  showMe?: boolean;
};

/** A dashed marigold ring, used by "Show me". */
function Ring({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`pointer-events-none absolute rounded-full border-[5px] border-dashed border-marigold ${className}`} />;
}

const circles = [
  { size: "7rem", left: "18%", top: "18%" },
  { size: "5.5rem", left: "62%", top: "45%" },
  { size: "4.5rem", left: "34%", top: "56%" },
];

export function ClickTask({ onDone, showMe }: TaskProps) {
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
      >
        {showMe && <Ring className="-inset-4" />}
      </button>
    </div>
  );
}

export function DoubleClickTask({ onDone, onHint, showMe }: TaskProps) {
  const t = useTranslations("mouse");
  const { settings } = useAppData();
  const last = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  // Two clicks within this time count as a double-click. Longer when "easier mouse" is on.
  const windowMs = settings.easyMouse ? 1400 : 600;

  return (
    <div className="flex h-[16rem] items-center justify-center rounded-sm bg-paper">
      <button
        type="button"
        onClick={(e) => {
          // Keyboard users press Enter: that counts as opening.
          if (e.detail === 0) return onDone();
          const now = Date.now();
          window.clearTimeout(timer.current);
          if (now - last.current <= windowMs) {
            last.current = 0;
            return onDone();
          }
          last.current = now;
          timer.current = window.setTimeout(() => onHint?.(t("dblHint")), windowMs + 50);
        }}
        className="relative flex flex-col items-center gap-2 rounded-md p-3 hover:bg-select focus-visible:bg-select"
      >
        {showMe && <Ring className="-inset-3" />}
        <Folder className="h-28 w-36 text-ink" />
        <span className="text-lg font-bold">{t("folder")}</span>
      </button>
    </div>
  );
}

export function DragTask({ onDone, onHint, showMe }: TaskProps) {
  const t = useTranslations("mouse");
  const { settings } = useAppData();
  const basketRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [picked, setPicked] = useState(false);

  const overBasket = (x: number, y: number) => {
    const b = basketRef.current?.getBoundingClientRect();
    return Boolean(b && x >= b.left - 10 && x <= b.right + 10 && y >= b.top - 30 && y <= b.bottom + 10);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (settings.easyMouse) return;
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
    if (overBasket(e.clientX, e.clientY)) return onDone();
    const moved = Math.abs(offset.x) + Math.abs(offset.y) > 12;
    setOffset({ x: 0, y: 0 });
    onHint?.(moved ? t("dragHint") : t("dragHelp"));
  };

  return (
    <div>
      <div
        className="relative h-[16rem] select-none overflow-hidden rounded-sm bg-paper"
        onClick={(e) => {
          // Easier mouse: click the mango to pick it up, click the basket to put it down.
          if (!settings.easyMouse || !picked) return;
          if (overBasket(e.clientX, e.clientY)) onDone();
          else {
            setPicked(false);
            onHint?.(t("dragHint"));
          }
        }}
      >
        <div ref={basketRef} className="absolute bottom-3 right-[6%] flex flex-col items-center">
          {showMe && <Ring className="-inset-3" />}
          <Basket className="h-28 w-40 text-ink" />
          <span className="font-bold">{t("basket")}</span>
        </div>
        {showMe && (
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-ink" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M22 35 Q50 10 76 62" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
            <path d="M70 58 L76 62 L77 55" fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        <button
          type="button"
          aria-label={t("mango")}
          aria-pressed={settings.easyMouse ? picked : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            start.current = null;
            setDragging(false);
            setOffset({ x: 0, y: 0 });
          }}
          onClick={(e) => {
            if (!settings.easyMouse) return;
            e.stopPropagation();
            setPicked(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDone();
            }
          }}
          className={`absolute left-[8%] top-[18%] z-10 touch-none rounded-full p-1 ${dragging ? "cursor-grabbing" : "cursor-grab"} ${
            picked ? "-translate-y-3 ring-4 ring-marigold" : ""
          }`}
          style={dragging || offset.x || offset.y ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}
        >
          <Mango className="pointer-events-none h-24 w-24 text-ink" />
        </button>
      </div>
      <p className="mt-3 text-ink-soft">{t("dragKeyboard")}</p>
    </div>
  );
}

export function ScrollTask({ onDone, showMe }: TaskProps) {
  const t = useTranslations("mouse");
  const found = useRef(false);
  return (
    <div className="relative">
      {showMe && (
        <p aria-hidden="true" className="pointer-events-none absolute -right-1 top-1/2 z-10 -translate-y-1/2 rounded-sm bg-marigold px-2 font-heading text-3xl">
          ↓
        </p>
      )}
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
        className={`h-[16rem] overflow-y-auto rounded-sm border-2 bg-paper px-5 ${showMe ? "border-dashed border-marigold" : "border-ink"}`}
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
    </div>
  );
}

/**
 * Press Backspace or Enter for real. Works with a physical keyboard and with
 * phone keyboards (which don't always report key names), by watching what the
 * key actually does in the text box.
 */
export function KeyTask({ which, onDone, showMe }: TaskProps & { which: "backspace" | "enter" }) {
  const t = useTranslations("player");
  const [value, setValue] = useState(which === "backspace" ? "Rahim" : "Rahima");
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    onDone();
  };
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (which === "enter") finish();
        }}
      >
        <label htmlFor="key-task" className="block font-bold">
          {t("typeHere")}
        </label>
        <input
          id="key-task"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            if (which === "backspace" && e.target.value.length < value.length) finish();
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (which === "backspace" && e.key === "Backspace") finish();
          }}
          className="mt-2 block w-full max-w-md rounded-md border-2 border-ink bg-white px-4 py-3 text-2xl"
        />
      </form>
      <p className="font-bold">{which === "backspace" ? t("pressBackspace") : t("pressEnter")}</p>
      <div className={`max-w-lg ${showMe ? "" : "opacity-90"}`}>
        <FigureDrawing figure={which === "backspace" ? "keyboard-backspace" : "keyboard-enter"} />
      </div>
    </div>
  );
}

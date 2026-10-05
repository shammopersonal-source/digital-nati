"use client";

import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import type { KeyName, MousePart } from "@/content/path";
import { Arrow, Loop } from "../illustrations/Drawings";

type Props<T extends string> = {
  selected: T | "letter" | null;
  onSelect: (part: T | "letter") => void;
  /** Circle the right answer ("Show me"). */
  highlight?: T | null;
  disabled?: boolean;
};

const fillFor = (selected: boolean) => (selected ? "var(--color-marigold-wash)" : "var(--color-white)");

const activate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

/** A big mouse picture whose left button, right button and wheel can be tapped. */
export function InteractiveMouse({ selected, onSelect, highlight, disabled }: Props<MousePart>) {
  const t = useTranslations("player");
  const parts: { id: MousePart; d: string }[] = [
    { id: "left", d: "M98 20 C55 22 44 60 42 98 Q70 104 98 104 Z" },
    { id: "right", d: "M102 20 C145 22 156 60 158 98 Q130 104 102 104 Z" },
    { id: "wheel", d: "M92 52 Q92 44 100 44 Q108 44 108 52 V70 Q108 78 100 78 Q92 78 92 70 Z" },
  ];
  const loops: Record<MousePart, [number, number, number, number]> = {
    left: [70, 62, 36, 46],
    right: [130, 62, 36, 46],
    wheel: [100, 61, 20, 28],
  };
  return (
    <svg viewBox="0 -6 200 220" className="mx-auto block h-[min(18rem,42vh)] text-ink" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinejoin="round">
      <path d="M42 100 Q100 110 158 100 C160 170 135 205 100 205 C65 205 40 170 42 100 Z" fill="var(--color-white)" />
      <path d="M100 20 C100 8 112 4 122 2" />
      {parts.map((p) => (
        <path
          key={p.id}
          d={p.d}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={t(p.id)}
          aria-pressed={selected === p.id}
          onClick={() => !disabled && onSelect(p.id)}
          onKeyDown={activate(() => !disabled && onSelect(p.id))}
          fill={fillFor(selected === p.id)}
          className="cursor-pointer outline-none hover:fill-[var(--color-paper-deep)] focus-visible:stroke-[5px]"
        />
      ))}
      {highlight && (
        <g pointerEvents="none">
          <Loop cx={loops[highlight][0]} cy={loops[highlight][1]} rx={loops[highlight][2]} ry={loops[highlight][3]} />
          <Arrow x1={highlight === "right" ? 196 : 4} y1={4} x2={highlight === "right" ? 166 : 34} y2={30} />
        </g>
      )}
    </svg>
  );
}

type KeyRect = { x: number; y: number; w: number; name: KeyName | "letter"; label?: string };

function keyboardKeys(): KeyRect[] {
  const keys: KeyRect[] = [];
  const row = (y: number, start: number, count: number) => {
    for (let i = 0; i < count; i++) keys.push({ x: start + i * 25, y, w: 22, name: "letter" });
  };
  row(14, 14, 12);
  keys.push({ x: 311, y: 14, w: 35, name: "backspace", label: "←" });
  keys.push({ x: 14, y: 40, w: 32, name: "letter" });
  row(40, 50, 11);
  keys.push({ x: 325, y: 40, w: 21, name: "letter" });
  keys.push({ x: 14, y: 66, w: 40, name: "letter" });
  row(66, 58, 10);
  keys.push({ x: 308, y: 66, w: 38, name: "enter", label: "Enter" });
  keys.push({ x: 14, y: 92, w: 52, name: "shift", label: "Shift" });
  row(92, 70, 10);
  keys.push({ x: 320, y: 92, w: 26, name: "shift", label: "Shift" });
  row(118, 14, 3);
  keys.push({ x: 89, y: 118, w: 171, name: "space", label: "Space" });
  keys.push({ x: 263, y: 118, w: 22, name: "letter" }, { x: 288, y: 118, w: 22, name: "letter" }, { x: 313, y: 118, w: 33, name: "letter" });
  return keys;
}

/** A keyboard picture whose keys can be tapped. Backspace, Enter, Shift and Space are labelled. */
export function InteractiveKeyboard({ selected, onSelect, highlight, disabled }: Props<KeyName>) {
  const t = useTranslations("player");
  const keys = keyboardKeys();
  const target = highlight ? keys.find((k) => k.name === highlight) : null;
  return (
    <svg viewBox="0 0 360 156" className="block w-full text-ink" fill="none" stroke="currentColor" strokeLinejoin="round">
      <path d="M6 6 H354 V148 H6 Z" fill="var(--color-paper-deep)" strokeWidth={2.4} />
      {keys.map((k, i) => {
        const isSelected = selected === k.name && (k.name !== "letter" || false);
        const label = k.label ?? "";
        return (
          <g
            key={i}
            role="button"
            tabIndex={disabled || k.name === "letter" ? -1 : 0}
            aria-label={k.name === "letter" ? t("letterKey") : label === "←" ? "Backspace" : label}
            aria-pressed={k.name !== "letter" ? isSelected : undefined}
            onClick={() => !disabled && onSelect(k.name)}
            onKeyDown={activate(() => !disabled && onSelect(k.name))}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[3.5px] [&:hover>rect]:fill-[var(--color-paper)]"
          >
            <rect x={k.x} y={k.y} width={k.w} height={22} rx={3} fill={fillFor(isSelected)} strokeWidth={k.label ? 2 : 1.4} />
            {label && (
              <text
                x={k.x + k.w / 2}
                y={k.y + 15.5}
                textAnchor="middle"
                fontSize={label === "←" ? 15 : 10}
                fontWeight={700}
                fill="currentColor"
                stroke="none"
                fontFamily="system-ui, sans-serif"
                pointerEvents="none"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
      {target && (
        <g pointerEvents="none" strokeWidth={2.6}>
          <Loop cx={target.x + target.w / 2} cy={target.y + 11} rx={target.w / 2 + 10} ry={20} />
        </g>
      )}
    </svg>
  );
}

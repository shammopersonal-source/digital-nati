"use client";

import type { KeyboardEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { KeyName, MousePart } from "@/content/path";
import { type Box, Ring, boxStyle, grow, keyBoxes, mouseBoxes, photos } from "../illustrations/Photos";

type Props<T extends string> = {
  selected: T | "letter" | null;
  onSelect: (part: T | "letter") => void;
  /** Circle the right answer ("Show me"). */
  highlight?: T | null;
  disabled?: boolean;
};

const activate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

/** A see-through button laid over one part of a photo. */
function Hotspot({
  box,
  label,
  selected,
  disabled,
  onPress,
  shape = "rounded-md",
}: {
  box: Box;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  shape?: string;
}) {
  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onPress()}
      onKeyDown={activate(() => !disabled && onPress())}
      style={boxStyle(box)}
      className={`absolute ${shape} border-[3px] ${
        selected ? "border-ink bg-marigold-wash/50" : "border-transparent hover:border-white hover:bg-white/20"
      } ${disabled ? "cursor-default" : "cursor-pointer"}`}
    />
  );
}

/** A big photo of a mouse whose left button, right button and wheel can be tapped. */
export function InteractiveMouse({ selected, onSelect, highlight, disabled }: Props<MousePart>) {
  const t = useTranslations("player");
  // The wheel comes last so it sits on top of the two buttons around it.
  const parts: { id: MousePart; shape: string }[] = [
    { id: "left", shape: "rounded-tl-[60%_45%] rounded-tr-md rounded-b-md" },
    { id: "right", shape: "rounded-tr-[60%_45%] rounded-tl-md rounded-b-md" },
    { id: "wheel", shape: "rounded-full" },
  ];
  return (
    <div className="relative mx-auto w-fit">
      <Image
        src={photos.mouse}
        alt=""
        sizes="300px"
        preload
        className="block h-[min(20rem,42vh)] w-auto select-none rounded-md"
        draggable={false}
      />
      {parts.map((p) => (
        <Hotspot
          key={p.id}
          box={mouseBoxes[p.id]}
          label={t(p.id)}
          selected={selected === p.id}
          disabled={disabled}
          onPress={() => onSelect(p.id)}
          shape={p.shape}
        />
      ))}
      {highlight && <Ring box={grow(mouseBoxes[highlight], 5, 4)} />}
    </div>
  );
}

/**
 * A photo of a keyboard whose keys can be tapped. Backspace, Enter, Shift (both)
 * and Space are buttons; tapping anywhere else on the keyboard counts as a letter key.
 */
export function InteractiveKeyboard({ selected, onSelect, highlight, disabled }: Props<KeyName>) {
  const t = useTranslations("player");
  const tp = useTranslations("photos");
  const keys: { id: KeyName; label: string }[] = [
    { id: "backspace", label: "Backspace" },
    { id: "enter", label: "Enter" },
    { id: "shift", label: "Shift" },
    { id: "space", label: "Space" },
  ];
  return (
    <div className="relative w-full">
      <Image src={photos.keyboardMain} alt={tp("keyboardTap")} sizes="(min-width: 640px) 36rem, 100vw" preload className="block h-auto w-full select-none rounded-md" draggable={false} />
      {/* Any other key: a letter. Not in the Tab order, like the letter keys before. */}
      <span
        role="button"
        tabIndex={-1}
        aria-label={t("letterKey")}
        onClick={() => !disabled && onSelect("letter")}
        className={`absolute inset-0 ${disabled ? "cursor-default" : "cursor-pointer"}`}
      />
      {keys.flatMap((k) =>
        keyBoxes[k.id].map((b, i) => (
          <Hotspot
            key={`${k.id}-${i}`}
            // A little bigger than the key itself, so it is easier to hit.
            box={grow(b, 0.6, 1.2)}
            label={k.label}
            selected={selected === k.id}
            disabled={disabled}
            onPress={() => onSelect(k.id)}
          />
        )),
      )}
      {highlight && keyBoxes[highlight].map((b, i) => <Ring key={i} box={grow(b, 2.5, 6)} />)}
    </div>
  );
}

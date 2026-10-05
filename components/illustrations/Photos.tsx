// Real photos of the things learners have on their own desk: a mouse, a
// keyboard, a monitor and a printer. Credits are in public/photos/CREDITS.md
// and on the /credits page (lib/photoCredits.ts).
//
// Positions on a photo are percentages of its width and height, measured by
// looking at the photo, so they stay right at every screen size.

import Image, { type StaticImageData } from "next/image";
import keyboardMain from "@/public/photos/keyboard-main.jpg";
import keyboardFull from "@/public/photos/keyboard.jpg";
import monitor from "@/public/photos/monitor.jpg";
import mouseHand from "@/public/photos/mouse-hand.jpg";
import mouse from "@/public/photos/mouse.jpg";
import printer from "@/public/photos/printer.jpg";

export const photos = { mouse, mouseHand, keyboardFull, keyboardMain, monitor, printer } satisfies Record<string, StaticImageData>;

/** A box on a photo, in percent: left, top, width, height. */
export type Box = { l: number; t: number; w: number; h: number };

/** Mouse parts on `mouse.jpg`. */
export const mouseBoxes = {
  left: { l: 18.1, t: 12.9, w: 29.9, h: 40.5 },
  right: { l: 49.5, t: 12.4, w: 32.6, h: 41.1 },
  wheel: { l: 42, t: 21.1, w: 11.3, h: 15.8 },
} satisfies Record<string, Box>;

/** Special keys on `keyboard-main.jpg` (the typing part of the keyboard, without the number pad). */
export const keyBoxes = {
  backspace: [{ l: 86.9, t: 23, w: 11, h: 11.2 }],
  enter: [{ l: 85.25, t: 53, w: 12.8, h: 10.9 }],
  shift: [
    { l: 1.8, t: 68.2, w: 12.2, h: 11.2 },
    { l: 82.1, t: 67.8, w: 16.1, h: 11.2 },
  ],
  space: [{ l: 27.1, t: 83.3, w: 36.4, h: 12.5 }],
} satisfies Record<string, Box[]>;

/** The same box made bigger by `x` and `y` percent on each side, for a ring around it. */
export const grow = (b: Box, x: number, y: number): Box => ({ l: b.l - x, t: b.t - y, w: b.w + 2 * x, h: b.h + 2 * y });

export const boxStyle = (b: Box) => ({ left: `${b.l}%`, top: `${b.t}%`, width: `${b.w}%`, height: `${b.h}%` });

/** The marigold "pen circle" around the important part of a photo. */
export function Ring({ box }: { box: Box }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full border-[5px] border-dashed border-marigold"
      style={boxStyle(box)}
    />
  );
}

/** A photo with one or more rings drawn on it. */
export function PhotoWithRing({
  photo,
  alt,
  rings = [],
  className = "",
  sizes = "(min-width: 640px) 36rem, 100vw",
}: {
  photo: StaticImageData;
  alt: string;
  rings?: Box[];
  className?: string;
  sizes?: string;
}) {
  return (
    <span className={`relative block ${className}`}>
      <Image src={photo} alt={alt} sizes={sizes} className="block h-auto w-full rounded-md" />
      {rings.map((b, i) => (
        <Ring key={i} box={b} />
      ))}
    </span>
  );
}

// Hand-drawn style line drawings, all in one consistent style:
// ink lines (currentColor), soft palette fills, and the shared "dn-rough"
// filter (see RoughFilter) that gives every line a slight pencil wobble.
//
// Real things (mouse, keyboard, monitor, printer) are photos instead: see Photos.tsx.
// The screen drawings stand in for real screenshots until we have them.
// See README.md → "Adding real photos and screenshots".

import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import type { AppKind, Figure, Picture } from "@/content/path";
import { type Box, PhotoWithRing, grow, keyBoxes, mouseBoxes, photos } from "./Photos";

const PAPER = "var(--color-white)";
const DEEP = "var(--color-paper-deep)";
const MARIGOLD_WASH = "var(--color-marigold-wash)";
const GREEN_WASH = "var(--color-green-wash)";
const GREEN = "var(--color-green)";
const MARIGOLD = "var(--color-marigold)";
const SKIN = "var(--color-skin)";
const INK = "var(--color-ink)";

/** Put this once on the page. Every drawing references it. */
export function RoughFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="dn-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
      </defs>
    </svg>
  );
}

function Svg({
  viewBox,
  className,
  label,
  children,
}: {
  viewBox: string;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g filter="url(#dn-rough)">{children}</g>
    </svg>
  );
}

/** A loose, hand-drawn loop around something important, like a pen circle on a printout. */
export function Loop({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  const points: string[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const a = -0.6 + (i / steps) * (Math.PI * 2 + 0.5);
    const grow = 1 + 0.06 * (i / steps);
    const x = cx + Math.cos(a) * rx * grow;
    const y = cy + Math.sin(a) * ry * grow;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return <path d={points.join(" ")} stroke={MARIGOLD} strokeWidth={5} />;
}

/** A small ink arrow pointing from (x1,y1) to (x2,y2). */
export function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  const p1 = `${x2 - h * Math.cos(a - 0.5)} ${y2 - h * Math.sin(a - 0.5)}`;
  const p2 = `${x2 - h * Math.cos(a + 0.5)} ${y2 - h * Math.sin(a + 0.5)}`;
  return (
    <path
      d={`M${x1} ${y1} Q${(x1 + x2) / 2 + 8} ${(y1 + y2) / 2 - 8} ${x2} ${y2} M${p1} L${x2} ${y2} L${p2}`}
      strokeWidth={2.6}
    />
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="7" fill={GREEN} />
      <path d="M10 14.5c8.5-.7 19.5-.6 28 .2l-.5 17.2c-8.6.5-18.4.4-27-.3z" fill="var(--color-paper)" />
      <path d="M19.5 37.5h9M24 32.5v5" stroke="var(--color-paper)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="24" cy="23" r="4.4" fill={MARIGOLD} />
    </svg>
  );
}

/** Home page: a laptop with a cup of cha beside it. */
export function LaptopWithCha({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 330 230" className={className}>
      <path d="M62 30 L232 28 L229 150 L66 152 Z" fill={PAPER} />
      <path d="M82 54 H170 M82 72 H204 M82 90 H150" />
      <path d="M82 112 H140 V132 H82 Z" fill={GREEN_WASH} />
      <path d="M176 110 V136 L183 129 L189 142 L194 140 L188 127 L197 126 Z" fill={PAPER} strokeWidth={2} />
      <path d="M40 152 L254 151 L274 172 Q150 180 20 172 Z" fill={DEEP} />
      <path d="M128 163 H172" />
      <path d="M270 120 L310 120 L305 166 Q289 172 274 166 Z" fill={MARIGOLD_WASH} />
      <path d="M309 128 Q326 130 321 145 Q317 154 306 152" />
      <path d="M258 170 Q292 180 324 170" />
      <path d="M282 110 Q275 100 282 92 Q289 84 282 74 M296 110 Q289 100 296 92 Q302 85 296 78" strokeWidth={2} />
    </Svg>
  );
}

/** Families: a phone with a message bubble. */
export function PhoneMessage({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 170 230" className={className}>
      <path d="M38 10 H132 Q142 10 142 20 V210 Q142 220 132 220 H38 Q28 220 28 210 V20 Q28 10 38 10 Z" fill={PAPER} />
      <path d="M72 24 H98" />
      <path d="M44 48 H112 Q120 48 120 56 V82 Q120 90 112 90 H62 L50 100 L52 90 H48 Q42 90 42 82 V56 Q42 48 48 48 Z" fill={DEEP} />
      <path d="M54 62 H106 M54 76 H90" strokeWidth={2} />
      <path d="M58 112 H122 Q128 112 128 118 V150 Q128 156 122 156 H120 L122 166 L110 156 H58 Q52 156 52 150 V118 Q52 112 58 112 Z" fill={GREEN_WASH} />
      <path d="M64 126 H116 M64 140 H100" strokeWidth={2} />
      <path d="M100 146 L106 151 L118 138" stroke={GREEN} strokeWidth={2.6} />
      <path d="M70 200 H100" />
    </Svg>
  );
}

/** A small "window" with a letter badge, used for app pictures. */
function Window({ badge, children }: { badge?: string; children: ReactNode }) {
  return (
    <>
      <path d="M8 8 H192 V124 H8 Z" fill={PAPER} />
      <path d="M8 28 H192" />
      {badge && (
        <>
          <path d="M14 12 H28 V25 H14 Z" fill={GREEN_WASH} strokeWidth={1.8} />
          <text x="21" y="22.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Georgia, serif">
            {badge}
          </text>
        </>
      )}
      <path d="M176 14 L184 22 M184 14 L176 22" strokeWidth={1.8} />
      <path d="M156 18 H166" strokeWidth={1.8} />
      {children}
    </>
  );
}

export function AppSketch({ kind, className }: { kind: AppKind; className?: string }) {
  switch (kind) {
    case "computer":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <path d="M42 8 H158 V80 H42 Z" fill={PAPER} />
          <path d="M54 22 H118 M54 34 H138 M54 46 H100" strokeWidth={2} />
          <path d="M92 80 V96 M76 96 H124" />
          <path d="M26 104 H142 V124 H26 Z" fill={DEEP} />
          <path d="M34 111 H134 M34 118 H134" strokeWidth={1.4} strokeDasharray="5 4" />
          <path d="M168 100 Q182 100 182 114 Q182 128 168 128 Q154 128 154 114 Q154 100 168 100 Z M168 100 V112" fill={MARIGOLD_WASH} />
        </Svg>
      );
    case "files":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <Window>
            {[24, 82, 140].map((x, i) => (
              <g key={x}>
                <path
                  d={`M${x} 52 H${x + 14} L${x + 19} 58 H${x + 38} V${x === 82 ? 92 : 90} H${x} Z`}
                  fill={i === 1 ? MARIGOLD_WASH : DEEP}
                />
                <path d={`M${x + 4} ${104} H${x + 34}`} strokeWidth={1.8} />
              </g>
            ))}
          </Window>
        </Svg>
      );
    case "internet":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <Window>
            <path d="M22 36 H178 V50 H22 Z" fill={DEEP} strokeWidth={1.8} />
            <path d="M30 43 H90" strokeWidth={1.6} />
            <circle cx="76" cy="88" r="24" fill={GREEN_WASH} />
            <path d="M52 88 H100 M76 64 Q62 88 76 112 M76 64 Q90 88 76 112" strokeWidth={1.8} />
            <path d="M136 62 Q150 68 164 62 V86 Q164 104 150 112 Q136 104 136 86 Z" fill={MARIGOLD_WASH} />
            <path d="M143 86 L149 92 L158 78" stroke={GREEN} strokeWidth={2.6} />
          </Window>
        </Svg>
      );
    case "email":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <Window>
            <path d="M52 44 H148 V108 H52 Z" fill={MARIGOLD_WASH} />
            <path d="M52 44 L100 80 L148 44" />
          </Window>
        </Svg>
      );
    case "word":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <Window badge="W">
            <path d="M44 38 H156 V124" fill="none" />
            <path d="M56 50 H108" strokeWidth={4} />
            <path d="M56 66 H144 M56 80 H138 M56 94 H120 M56 108 H90" strokeWidth={1.8} />
          </Window>
        </Svg>
      );
    case "excel":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <Window badge="X">
            <path d="M22 40 H178 V116 H22 Z" fill={PAPER} strokeWidth={1.8} />
            <path d="M22 59 H178 M22 78 H178 M22 97 H178 M61 40 V116 M100 40 V116 M139 40 V116" strokeWidth={1.4} />
            <path d="M22 40 H178 V59 H22 Z" fill={DEEP} strokeWidth={1.4} />
            <path d="M139 97 H178 V116 H139 Z" fill={MARIGOLD_WASH} strokeWidth={1.8} />
          </Window>
        </Svg>
      );
    case "powerpoint":
      return (
        <Svg viewBox="0 0 200 132" className={className}>
          <Window badge="P">
            <path d="M38 38 H162 V116 H38 Z" fill={PAPER} />
            <path d="M56 52 H120" strokeWidth={3.5} />
            <path d="M56 70 H144 V106 H56 Z" fill={GREEN_WASH} strokeWidth={1.8} />
            <path d="M60 104 L84 82 L100 96 L112 86 L140 104" strokeWidth={1.8} />
            <circle cx="128" cy="80" r="6" fill={MARIGOLD_WASH} strokeWidth={1.8} />
          </Window>
        </Svg>
      );
  }
}

function WordFigure({ highlight }: { highlight: "bold" | "bigger" | "save" }) {
  const label = (x: number, y: number, s: string, size = 12, weight = 700) => (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={weight} fill="currentColor" stroke="none" fontFamily="Georgia, serif">
      {s}
    </text>
  );
  const loops = {
    save: { cx: 25, cy: 19, rx: 18, ry: 16, ax: 70, ay: 4 },
    bigger: { cx: 79, cy: 58, rx: 18, ry: 18, ax: 40, ay: 100 },
    bold: { cx: 121, cy: 58, rx: 17, ry: 18, ax: 170, ay: 104 },
  }[highlight];
  return (
    <Svg viewBox="0 0 360 176" className="h-full w-full">
      <path d="M6 6 H354 V170 H6 Z" fill={DEEP} />
      <path d="M6 32 H354" />
      <path d="M16 11 h18 v16 h-18 Z M20 11 v6 h10 v-6 M21 21 h8" strokeWidth={1.6} fill={PAPER} />
      {label(180, 24, "My letter - Word", 11, 400)}
      <path d="M6 82 H354" />
      {label(30, 46, "Home", 10, 700)}
      <path d="M16 50 H46" strokeWidth={2} />
      <path d="M30 48 h34 v20 h-34 Z" fill={PAPER} strokeWidth={1.6} transform="translate(-14 2)" />
      {label(33, 66, "11", 11, 400)}
      <path d="M68 48 h22 v20 h-22 Z" fill={PAPER} strokeWidth={1.6} />
      {label(79, 64, "A▲", 10)}
      <path d="M110 48 h22 v20 h-22 Z" fill={highlight === "bold" ? MARIGOLD_WASH : PAPER} strokeWidth={1.6} />
      {label(121, 64, "B", 14)}
      <path d="M136 48 h22 v20 h-22 Z" fill={PAPER} strokeWidth={1.6} />
      <text x={147} y={64} textAnchor="middle" fontSize={14} fontStyle="italic" fill="currentColor" stroke="none" fontFamily="Georgia, serif">
        I
      </text>
      <path d="M162 48 h22 v20 h-22 Z M168 66 h10" fill={PAPER} strokeWidth={1.6} />
      {label(173, 62, "U", 12, 400)}
      <path d="M70 92 H290 V170" fill={PAPER} />
      <path d="M86 110 H150 M86 128 H120" strokeWidth={1.8} />
      <path d="M126 128 H176" strokeWidth={4.5} />
      <path d="M182 128 H250 M86 146 H220" strokeWidth={1.8} />
      <Loop cx={loops.cx} cy={loops.cy} rx={loops.rx} ry={loops.ry} />
      <Arrow x1={loops.ax} y1={loops.ay} x2={loops.cx + (loops.ax > loops.cx ? 18 : -14)} y2={loops.cy + (loops.ay > loops.cy ? 18 : -8)} />
    </Svg>
  );
}

function StartLogo({ x, y, s = 14 }: { x: number; y: number; s?: number }) {
  const h = s / 2 - 1;
  return (
    <path
      d={`M${x} ${y} h${h} v${h} h-${h} Z M${x + h + 2} ${y} h${h} v${h} h-${h} Z M${x} ${y + h + 2} h${h} v${h} h-${h} Z M${x + h + 2} ${y + h + 2} h${h} v${h} h-${h} Z`}
      fill={GREEN_WASH}
      strokeWidth={1.6}
    />
  );
}

function PowerSymbol({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return (
    <path
      d={`M${cx - r * 0.7} ${cy - r * 0.7} A${r} ${r} 0 1 0 ${cx + r * 0.7} ${cy - r * 0.7} M${cx} ${cy - r - 2} V${cy}`}
      strokeWidth={2}
    />
  );
}

function StartFigure({ menu }: { menu: boolean }) {
  return (
    <Svg viewBox="0 0 360 200" className="h-full w-full">
      <path d="M6 6 H354 V194 H6 Z" fill={GREEN_WASH} />
      <path d="M6 166 H354 V194 H6 Z" fill={DEEP} />
      <StartLogo x={142} y={172} s={18} />
      <path d="M170 172 h16 v16 h-16 Z M194 172 h16 v16 h-16 Z" strokeWidth={1.6} fill={PAPER} />
      {!menu && (
        <>
          <Loop cx={151} cy={181} rx={18} ry={16} />
          <Arrow x1={90} y1={120} x2={130} y2={168} />
        </>
      )}
      {menu && (
        <>
          <path d="M70 20 H290 V158 H70 Z" fill={PAPER} />
          <path d="M84 36 H180 M84 54 H220 M84 72 H200" strokeWidth={1.8} />
          <path d="M70 136 H290" strokeWidth={1.6} />
          <PowerSymbol cx={268} cy={148} />
          <path d="M196 64 H262 V126 H196 Z" fill={PAPER} strokeWidth={1.8} />
          {["Sleep", "Shut down", "Restart"].map((s, i) => (
            <text key={s} x={204} y={82 + i * 18} fontSize={10.5} fill="currentColor" stroke="none" fontFamily="system-ui, sans-serif" fontWeight={i === 1 ? 700 : 400}>
              {s}
            </text>
          ))}
          <Loop cx={268} cy={147} rx={15} ry={13} />
          <Loop cx={228} cy={96} rx={34} ry={11} />
        </>
      )}
    </Svg>
  );
}

type PhotoFigure = Extract<Figure, `mouse-${string}` | `keyboard-${string}`>;

/** A real photo with the important part circled. */
function FigurePhoto({ figure, decorative }: { figure: PhotoFigure; decorative?: boolean }) {
  const t = useTranslations("photos");
  const [photo, rings, alt]: [StaticImageData, Box[], string] = (() => {
    switch (figure) {
      case "mouse-hand":
        return [photos.mouseHand, [{ l: 37, t: 12, w: 50, h: 52 }], t("mouseHand")];
      case "mouse-left":
        return [photos.mouse, [grow(mouseBoxes.left, 5, 4)], t("mouseLeft")];
      case "mouse-wheel":
        return [photos.mouse, [grow(mouseBoxes.wheel, 5, 4)], t("mouseWheel")];
      case "keyboard-backspace":
        return [photos.keyboardMain, keyBoxes.backspace.map((b) => grow(b, 2.5, 6)), t("keyboardBackspace")];
      case "keyboard-space":
        return [photos.keyboardMain, keyBoxes.space.map((b) => grow(b, 2.5, 6)), t("keyboardSpace")];
      case "keyboard-enter":
        return [photos.keyboardMain, keyBoxes.enter.map((b) => grow(b, 2.5, 6)), t("keyboardEnter")];
      case "keyboard-shift":
        return [photos.keyboardMain, keyBoxes.shift.map((b) => grow(b, 2.5, 6)), t("keyboardShift")];
    }
  })();
  // The hand photo is wide but not detailed: keep it small enough to see the whole screen.
  return <PhotoWithRing photo={photo} rings={rings} alt={decorative ? "" : alt} className={figure === "mouse-hand" ? "mx-auto max-w-sm" : ""} />;
}

/** The picture for a lesson step: a photo for real things, a drawing for screens. */
export function FigureDrawing({ figure, decorative }: { figure: Figure; decorative?: boolean }) {
  switch (figure) {
    case "mouse-hand":
    case "mouse-left":
    case "mouse-wheel":
    case "keyboard-backspace":
    case "keyboard-space":
    case "keyboard-enter":
    case "keyboard-shift":
      return <FigurePhoto figure={figure} decorative={decorative} />;
    case "start-button":
      return <StartFigure menu={false} />;
    case "power-menu":
      return <StartFigure menu />;
    case "word-bold":
      return <WordFigure highlight="bold" />;
    case "word-bigger":
      return <WordFigure highlight="bigger" />;
    case "word-save":
      return <WordFigure highlight="save" />;
  }
}

/** True for wide pictures (keyboard, hand on mouse, screens) so they get more room. */
export const isWideFigure = (figure: Figure) => figure === "mouse-hand" || !figure.startsWith("mouse");

// ---- Practice pictures ----

export function Mango({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 80 80" className={className}>
      <path d="M40 14 C62 12 72 34 66 52 C60 70 36 74 22 62 C8 50 14 18 40 14 Z" fill={MARIGOLD} />
      <path d="M40 14 Q42 6 48 4" />
      <path d="M46 8 Q60 2 66 12 Q54 16 46 8 Z" fill={GREEN_WASH} />
    </Svg>
  );
}

export function Basket({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 140 100" className={className}>
      <path d="M30 40 Q70 -6 110 40" strokeWidth={3} />
      <path d="M10 40 H130 L116 94 H24 Z" fill={MARIGOLD_WASH} />
      <path d="M18 58 H122 M22 76 H118 M50 40 L54 94 M90 40 L86 94" strokeWidth={1.8} />
    </Svg>
  );
}

export function Folder({ className, open }: { className?: string; open?: boolean }) {
  return (
    <Svg viewBox="0 0 120 96" className={className}>
      <path d="M8 16 H44 L54 28 H112 V88 H8 Z" fill={MARIGOLD_WASH} />
      {open && (
        <>
          <path d="M22 36 H70 V78 H22 Z" fill={PAPER} strokeWidth={1.8} />
          <path d="M28 70 L40 56 L50 66 L56 60 L66 70" strokeWidth={1.6} />
          <path d="M8 46 H104 L112 88 H8 Z" fill={MARIGOLD_WASH} />
        </>
      )}
    </Svg>
  );
}

export function Flower({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 100 120" className={className}>
      <path d="M50 60 V116 M50 92 Q36 80 26 86 Q36 100 50 98" stroke={GREEN} strokeWidth={3} fill={GREEN_WASH} />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="50" cy="26" rx="12" ry="20" transform={`rotate(${deg} 50 44)`} fill={MARIGOLD_WASH} />
      ))}
      <circle cx="50" cy="44" r="10" fill={MARIGOLD} />
    </Svg>
  );
}

// ---- Nati, the guide ----

export type NatiMood = "talk" | "happy" | "gentle";

/** Nati: a friendly grandchild who guides every lesson. */
export function Nati({ mood = "talk", className }: { mood?: NatiMood; className?: string }) {
  return (
    <Svg viewBox="0 0 120 150" className={className}>
      <path d="M28 150 L33 110 Q60 96 87 110 L92 150 Z" fill={GREEN} />
      <path d="M52 102 L60 114 L68 102" stroke="var(--color-paper)" strokeWidth={2} />
      <path d="M54 86 V102 H66 V86" fill={SKIN} />
      <circle cx="33" cy="66" r="5" fill={SKIN} />
      <circle cx="87" cy="66" r="5" fill={SKIN} />
      <circle cx="60" cy="62" r="27" fill={SKIN} />
      <path d="M33 60 Q31 32 60 31 Q89 32 87 60 Q82 47 68 44 Q52 50 33 60 Z" fill={INK} />
      {mood === "happy" ? (
        <path d="M46 64 Q50 59 54 64 M66 64 Q70 59 74 64" strokeWidth={2.4} />
      ) : (
        <>
          <circle cx="50" cy="63" r="2.8" fill={INK} stroke="none" />
          <circle cx="70" cy="63" r="2.8" fill={INK} stroke="none" />
        </>
      )}
      {mood === "gentle" ? (
        <>
          <path d="M45 55 Q50 53 55 55 M65 55 Q70 53 75 55" strokeWidth={1.8} />
          <path d="M52 77 Q60 81 68 77" />
        </>
      ) : (
        <path d={mood === "happy" ? "M47 74 Q60 88 73 74" : "M50 75 Q60 83 70 75"} />
      )}
      <circle cx="44" cy="72" r="3.5" fill={MARIGOLD_WASH} stroke="none" />
      <circle cx="76" cy="72" r="3.5" fill={MARIGOLD_WASH} stroke="none" />
      {mood === "happy" && (
        <>
          <path d="M86 112 Q98 100 104 84" strokeWidth={10} />
          <path d="M86 112 Q98 100 104 84" strokeWidth={5.5} stroke={GREEN} />
          <circle cx="105" cy="79" r="6" fill={SKIN} />
        </>
      )}
      {mood === "gentle" && (
        <>
          <path d="M84 114 Q80 100 74 92" strokeWidth={10} />
          <path d="M84 114 Q80 100 74 92" strokeWidth={5.5} stroke={GREEN} />
          <circle cx="72" cy="88" r="6" fill={SKIN} />
        </>
      )}
    </Svg>
  );
}

// ---- Answer pictures ----

const picturePhotos: Record<Picture, { photo: StaticImageData; alt: "picMouse" | "picKeyboard" | "picScreen" | "picPrinter" }> = {
  mouse: { photo: photos.mouse, alt: "picMouse" },
  keyboard: { photo: photos.keyboardFull, alt: "picKeyboard" },
  screen: { photo: photos.monitor, alt: "picScreen" },
  printer: { photo: photos.printer, alt: "picPrinter" },
};

/**
 * A photo of a real thing. `boxed` fits it inside a square (for answer buttons);
 * `decorative` leaves out the description when the button already says it.
 */
export function PictureDrawing({
  picture,
  className = "",
  boxed = false,
  decorative = false,
}: {
  picture: Picture;
  className?: string;
  boxed?: boolean;
  decorative?: boolean;
}) {
  const t = useTranslations("player");
  const { photo, alt } = picturePhotos[picture];
  return boxed ? (
    <span className={`relative block aspect-square ${className}`}>
      <Image src={photo} alt={decorative ? "" : t(alt)} fill sizes="(min-width: 640px) 12rem, 30vw" className="object-contain" />
    </span>
  ) : (
    <Image src={photo} alt={decorative ? "" : t(alt)} sizes="(min-width: 640px) 36rem, 100vw" className={`block h-auto ${className}`} />
  );
}

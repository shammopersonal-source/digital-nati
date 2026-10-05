// Hand-drawn style line drawings, all in one consistent style:
// ink lines (currentColor), soft palette fills, and the shared "dn-rough"
// filter (see RoughFilter) that gives every line a slight pencil wobble.
//
// These stand in for real photos and screenshots until we have them.
// See README.md → "Adding real photos and screenshots".

import type { ReactNode } from "react";
import type { AppKind, Figure, Picture } from "@/content/path";

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

function MouseBody() {
  return (
    <>
      <path d="M100 20 C150 20 160 70 160 120 C160 180 135 205 100 205 C65 205 40 180 40 120 C40 70 50 20 100 20 Z" fill={PAPER} />
      <path d="M42 98 Q100 108 158 98 M100 20 V102" />
      <path d="M92 44 H108 V78 H92 Z" fill={DEEP} />
      <path d="M100 20 C100 8 112 4 122 2" />
    </>
  );
}

function MouseFigure({ highlight }: { highlight: "hand" | "left" | "wheel" }) {
  return (
    <Svg viewBox="0 -4 210 215" className="h-full w-full">
      <MouseBody />
      {highlight === "hand" && (
        <>
          <path d="M56 42 Q68 32 80 42 L86 132 Q70 140 54 132 Z" fill={MARIGOLD_WASH} />
          <path d="M116 38 Q128 28 140 38 L140 136 Q128 144 114 136 Z" fill={MARIGOLD_WASH} />
          <path d="M40 132 Q100 112 160 132 L168 206 Q100 222 32 206 Z" fill={MARIGOLD_WASH} />
        </>
      )}
      {highlight === "left" && (
        <>
          <path d="M44 96 C44 64 54 24 98 22 V100 Q70 102 44 96 Z" fill={MARIGOLD_WASH} stroke="none" />
          <MouseBody />
          <Loop cx={71} cy={62} rx={40} ry={48} />
          <Arrow x1={8} y1={8} x2={34} y2={30} />
        </>
      )}
      {highlight === "wheel" && (
        <>
          <Loop cx={100} cy={61} rx={22} ry={30} />
          <Arrow x1={190} y1={10} x2={128} y2={46} />
        </>
      )}
    </Svg>
  );
}

type Key = "backspace" | "space" | "enter" | "shift";

function KeyboardFigure({ highlight }: { highlight: Key }) {
  const row = (y: number, start: number, count: number) =>
    Array.from({ length: count }, (_, i) => (
      <path key={`${y}-${i}`} d={`M${start + i * 25} ${y} h22 v22 h-22 Z`} strokeWidth={1.6} />
    ));
  const special: Record<Key, { d: string; label: string; tx: number; ty: number; loop: [number, number, number, number] }> = {
    backspace: { d: "M311 14 h35 v22 h-35 Z", label: "←", tx: 328, ty: 30, loop: [328, 25, 30, 20] },
    enter: { d: "M308 66 h38 v22 h-38 Z", label: "Enter", tx: 327, ty: 81, loop: [327, 77, 32, 20] },
    shift: { d: "M14 92 h52 v22 h-52 Z", label: "Shift", tx: 40, ty: 107, loop: [40, 103, 38, 20] },
    space: { d: "M89 118 h171 v22 h-171 Z", label: "Space", tx: 174, ty: 133, loop: [174, 129, 98, 20] },
  };
  const keys: Key[] = ["backspace", "enter", "shift", "space"];
  return (
    <Svg viewBox="0 0 360 156" className="h-full w-full">
      <path d="M6 6 H354 V148 H6 Z" fill={DEEP} />
      {row(14, 14, 12)}
      <path d="M14 40 h32 v22 h-32 Z" strokeWidth={1.6} />
      {row(40, 50, 11)}
      <path d="M325 40 h21 v22 h-21 Z" strokeWidth={1.6} />
      <path d="M14 66 h40 v22 h-40 Z" strokeWidth={1.6} />
      {row(66, 58, 10)}
      {row(92, 70, 10)}
      <path d="M320 92 h26 v22 h-26 Z" strokeWidth={1.6} />
      {row(118, 14, 3)}
      <path d="M263 118 h22 v22 h-22 Z M288 118 h22 v22 h-22 Z M313 118 h33 v22 h-33 Z" strokeWidth={1.6} />
      {keys.map((k) => (
        <g key={k}>
          <path d={special[k].d} fill={k === highlight ? MARIGOLD_WASH : PAPER} strokeWidth={k === highlight ? 2.6 : 1.6} />
          <text
            x={special[k].tx}
            y={special[k].ty}
            textAnchor="middle"
            fontSize={k === "backspace" ? 15 : 10}
            fontWeight="700"
            fill="currentColor"
            stroke="none"
            fontFamily="system-ui, sans-serif"
          >
            {special[k].label}
          </text>
        </g>
      ))}
      <Loop cx={special[highlight].loop[0]} cy={special[highlight].loop[1]} rx={special[highlight].loop[2]} ry={special[highlight].loop[3]} />
    </Svg>
  );
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

/** The diagram for a lesson step. */
export function FigureDrawing({ figure }: { figure: Figure }) {
  switch (figure) {
    case "mouse-hand":
      return <MouseFigure highlight="hand" />;
    case "mouse-left":
      return <MouseFigure highlight="left" />;
    case "mouse-wheel":
      return <MouseFigure highlight="wheel" />;
    case "keyboard-backspace":
      return <KeyboardFigure highlight="backspace" />;
    case "keyboard-space":
      return <KeyboardFigure highlight="space" />;
    case "keyboard-enter":
      return <KeyboardFigure highlight="enter" />;
    case "keyboard-shift":
      return <KeyboardFigure highlight="shift" />;
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

/** True for wide diagrams (keyboard, screens) so they get more room. */
export const isWideFigure = (figure: Figure) => !figure.startsWith("mouse");

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

export function PictureDrawing({ picture, className }: { picture: Picture; className?: string }) {
  switch (picture) {
    case "mouse":
      return (
        <Svg viewBox="0 0 120 110" className={className}>
          <path d="M60 14 C88 14 94 42 94 66 C94 92 80 104 60 104 C40 104 26 92 26 66 C26 42 32 14 60 14 Z" fill={PAPER} />
          <path d="M27 54 Q60 60 93 54 M60 14 V57" />
          <path d="M55 26 H65 V44 H55 Z" fill={DEEP} />
          <path d="M60 14 C60 8 66 6 72 4" />
        </Svg>
      );
    case "keyboard":
      return (
        <Svg viewBox="0 0 160 90" className={className}>
          <path d="M6 14 H154 V78 H6 Z" fill={DEEP} />
          {[22, 36, 50].map((y) =>
            Array.from({ length: 10 }, (_, i) => <path key={`${y}-${i}`} d={`M${14 + i * 13.5} ${y} h10 v10 h-10 Z`} strokeWidth={1.4} fill={PAPER} />),
          )}
          <path d="M40 64 H120 V73 H40 Z" strokeWidth={1.6} fill={PAPER} />
        </Svg>
      );
    case "screen":
      return (
        <Svg viewBox="0 0 140 110" className={className}>
          <path d="M14 8 H126 V78 H14 Z" fill={PAPER} />
          <path d="M26 22 H90 M26 34 H108 M26 46 H76" strokeWidth={2} />
          <path d="M70 78 V94 M50 96 H90" />
        </Svg>
      );
    case "printer":
      return (
        <Svg viewBox="0 0 140 110" className={className}>
          <path d="M40 10 H100 V40 H40 Z" fill={PAPER} />
          <path d="M14 40 H126 V84 H14 Z" fill={DEEP} />
          <path d="M40 70 H100 V102 H40 Z" fill={PAPER} />
          <path d="M50 82 H90 M50 92 H80" strokeWidth={1.8} />
        </Svg>
      );
  }
}

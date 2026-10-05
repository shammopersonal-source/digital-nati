import {
  Atkinson_Hyperlegible,
  Galada,
  Hind_Siliguri,
  Kalam,
  Source_Serif_4,
  Tiro_Bangla,
} from "next/font/google";

// Body: Atkinson Hyperlegible (made for readers with low vision); Bangla falls back to Hind Siliguri.
// Headings: Source Serif 4; Bangla falls back to Tiro Bangla.
// Handwritten margin notes: Kalam; Bangla falls back to Galada.
// The order in --font-body / --font-heading (globals.css) makes each script use its own font.

export const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
});

export const hindSiliguri = Hind_Siliguri({
  weight: ["400", "600"],
  subsets: ["bengali"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const sourceSerif = Source_Serif_4({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const tiroBangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali"],
  variable: "--font-tiro-bangla",
  display: "swap",
});

export const kalam = Kalam({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
  preload: false,
});

export const galada = Galada({
  weight: "400",
  subsets: ["bengali"],
  variable: "--font-galada",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  atkinson,
  hindSiliguri,
  sourceSerif,
  tiroBangla,
  kalam,
  galada,
]
  .map((f) => f.variable)
  .join(" ");

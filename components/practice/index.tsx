import type { ReactNode } from "react";
import type { Figure, Practice } from "@/content/path";
import MousePractice from "./MousePractice";
import KeyboardPractice from "./KeyboardPractice";
import ShutdownPractice from "./ShutdownPractice";
import WordPractice from "./WordPractice";

/** Every "Try it" exercise, by name. Used in lessons and in the practice room. */
export const practices: Record<Practice, (p: { onDone: () => void }) => ReactNode> = {
  mouse: MousePractice,
  keyboard: KeyboardPractice,
  shutdown: ShutdownPractice,
  word: WordPractice,
};

/** What the practice room offers, in order, with the lesson that teaches each one. */
export const playground: { id: Practice; figure: Figure; lesson?: { chapterId: string; lessonId: string } }[] = [
  { id: "mouse", figure: "mouse-left", lesson: { chapterId: "mouse", lessonId: "meet" } },
  { id: "keyboard", figure: "keyboard-enter", lesson: { chapterId: "keyboard", lessonId: "typing" } },
  { id: "shutdown", figure: "power-menu" },
  { id: "word", figure: "word-bold" },
];

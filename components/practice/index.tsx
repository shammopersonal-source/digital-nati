import type { ReactNode } from "react";
import type { Figure, Practice } from "@/content/courses";
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
export const playground: { id: Practice; figure: Figure; lesson: { courseId: string; lessonId: string } }[] = [
  { id: "mouse", figure: "mouse-left", lesson: { courseId: "computer-basics", lessonId: "mouse" } },
  { id: "keyboard", figure: "keyboard-enter", lesson: { courseId: "computer-basics", lessonId: "keyboard" } },
  { id: "shutdown", figure: "power-menu", lesson: { courseId: "computer-basics", lessonId: "turn-off" } },
  { id: "word", figure: "word-bold", lesson: { courseId: "word", lessonId: "first-letter" } },
];

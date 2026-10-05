// Everything Digital Nati remembers about a learner, kept in this browser's localStorage.
//
// This is the only file that knows *where* data is stored. To move to a real
// backend (e.g. Supabase), keep the exported functions and their shapes the
// same and change how `read` and `write` load and save data. Pages and
// components never touch localStorage directly.

import { useSyncExternalStore } from "react";
import { STORAGE_KEY } from "./storage-key";

export type TextSize = "normal" | "large" | "xl";

export type Settings = {
  textSize: TextSize;
  highContrast: boolean;
  readAloud: boolean;
  /** Slower double-click and click-to-pick-up dragging, for unsteady hands. */
  easyMouse: boolean;
};

export type Helper = { name: string; phone: string };

export type Learner = {
  name: string;
  phone: string;
  helper: Helper | null;
};

export type CourseProgress = {
  /** Lesson ids the learner has finished. */
  completed: string[];
  /** When the last lesson of the course was finished (ISO date). */
  finishedAt?: string;
};

export type AppData = {
  version: 1;
  settings: Settings;
  learner: Learner | null;
  progress: Record<string, CourseProgress>;
  /** The lesson the learner opened most recently. */
  lastVisited: { courseId: string; lessonId: string } | null;
  /** Minutes learned per day, keyed "YYYY-MM-DD" (local time). */
  days: Record<string, number>;
  /** Minutes a day the learner aims for. null until they choose. */
  dailyGoal: 5 | 10 | 15 | null;
  /** Exercises answered wrong at least once, as "chapter/lesson/index". Brush-up uses these first. */
  mistakes: string[];
};

export { STORAGE_KEY };

export const DEFAULT_SETTINGS: Settings = {
  textSize: "normal",
  highContrast: false,
  readAloud: false,
  easyMouse: false,
};

const DEFAULT_DATA: AppData = {
  version: 1,
  settings: DEFAULT_SETTINGS,
  learner: null,
  progress: {},
  lastVisited: null,
  days: {},
  dailyGoal: null,
  mistakes: [],
};

function applySettingsToDocument(settings: Settings) {
  const html = document.documentElement;
  html.dataset.textSize = settings.textSize;
  html.dataset.contrast = settings.highContrast ? "high" : "normal";
}

let cache: AppData | null = null;
const listeners = new Set<() => void>();

function read(): AppData {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AppData>) : {};
    cache = {
      ...DEFAULT_DATA,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      progress: parsed.progress ?? {},
      days: parsed.days ?? {},
      mistakes: parsed.mistakes ?? [],
    };
  } catch {
    cache = DEFAULT_DATA;
  }
  return cache;
}

function write(next: AppData) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing or full storage: keep working for this visit.
  }
  applySettingsToDocument(next.settings);
  listeners.forEach((l) => l());
}

function update(fn: (data: AppData) => AppData) {
  write(fn(read()));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    applySettingsToDocument(read().settings);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The learner's saved data. On the server and during the first render this
 * returns the defaults; the saved data appears right after hydration.
 */
export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_DATA);
}

/** False during server rendering and hydration, true once saved data is loaded. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

// ---- Settings ----

export function saveSettings(patch: Partial<Settings>) {
  update((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
}

// ---- Learner ----

export function saveLearner(learner: Learner) {
  update((d) => ({ ...d, learner }));
}

export function logOut() {
  update((d) => ({ ...d, learner: null }));
}

// ---- Progress ----

export function markVisited(courseId: string, lessonId: string) {
  update((d) => ({ ...d, lastVisited: { courseId, lessonId } }));
}

export function completeLesson(
  courseId: string,
  lessonId: string,
  allLessonIds: string[],
) {
  update((d) => {
    const prev = d.progress[courseId] ?? { completed: [] };
    const completed = prev.completed.includes(lessonId)
      ? prev.completed
      : [...prev.completed, lessonId];
    const allDone = allLessonIds.every((id) => completed.includes(id));
    return {
      ...d,
      progress: {
        ...d.progress,
        [courseId]: {
          completed,
          finishedAt: allDone
            ? (prev.finishedAt ?? new Date().toISOString())
            : undefined,
        },
      },
    };
  });
}

export type ProgressBackup = Pick<AppData, "progress" | "lastVisited" | "days" | "mistakes">;

/** Removes all progress and returns what was removed, so it can be undone. */
export function clearProgress(): ProgressBackup {
  const { progress, lastVisited, days, mistakes } = read();
  update((d) => ({ ...d, progress: {}, lastVisited: null, days: {}, mistakes: [] }));
  return { progress, lastVisited, days, mistakes };
}

export function restoreProgress(backup: ProgressBackup) {
  update((d) => ({ ...d, ...backup }));
}

// ---- Daily practice ----

/** "YYYY-MM-DD" for a date in the learner's own time zone. */
export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addMinutes(minutes: number) {
  const key = dayKey();
  update((d) => ({ ...d, days: { ...d.days, [key]: (d.days[key] ?? 0) + minutes } }));
}

export function setDailyGoal(goal: 5 | 10 | 15) {
  update((d) => ({ ...d, dailyGoal: goal }));
}

// ---- Mistakes (for brush-up) ----

export function recordMistakes(add: string[], remove: string[] = []) {
  update((d) => {
    const set = new Set(d.mistakes);
    remove.forEach((k) => set.delete(k));
    add.forEach((k) => set.add(k));
    return { ...d, mistakes: [...set] };
  });
}

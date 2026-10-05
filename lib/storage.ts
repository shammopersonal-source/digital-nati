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
};

export { STORAGE_KEY };

export const DEFAULT_SETTINGS: Settings = {
  textSize: "normal",
  highContrast: false,
  readAloud: false,
};

const DEFAULT_DATA: AppData = {
  version: 1,
  settings: DEFAULT_SETTINGS,
  learner: null,
  progress: {},
  lastVisited: null,
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

export type ProgressBackup = Pick<AppData, "progress" | "lastVisited">;

/** Removes all progress and returns what was removed, so it can be undone. */
export function clearProgress(): ProgressBackup {
  const { progress, lastVisited } = read();
  update((d) => ({ ...d, progress: {}, lastVisited: null }));
  return { progress, lastVisited };
}

export function restoreProgress(backup: ProgressBackup) {
  update((d) => ({ ...d, ...backup }));
}

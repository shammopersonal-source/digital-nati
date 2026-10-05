"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import PracticeShell from "./PracticeShell";
import { Button } from "../Button";

type Message = { kind: "success" | "hint"; text: string } | null;

/** Type a name, rub out one letter with Backspace, then press Enter. */
export default function KeyboardPractice({ onDone }: { onDone: () => void }) {
  const t = useTranslations("keyboard");
  const tp = useTranslations("practice");
  const [task, setTask] = useState(0);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<Message>(null);
  const input = useRef<HTMLInputElement>(null);

  const advance = (to: number) => {
    setTask(to);
    setMessage({ kind: "success", text: tp("wellDone") });
    if (to === 3) onDone();
    input.current?.focus();
  };

  const tasks = [
    { title: t("typeTitle"), help: t("typeHelp") },
    { title: t("backspaceTitle"), help: t("backspaceHelp") },
    { title: t("enterTitle"), help: t("enterHelp") },
  ];
  const current = tasks[Math.min(task, 2)];

  return (
    <PracticeShell
      task={task}
      total={3}
      title={current.title}
      help={current.help}
      message={message}
      done={task > 2}
      doneText={t("allDone")}
      onRestart={() => {
        setTask(0);
        setValue("");
        setMessage(null);
      }}
    >
      <label htmlFor="keyboard-practice" className="block text-lg font-bold">
        {t("box")}
      </label>
      <input
        id="keyboard-practice"
        ref={input}
        value={value}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
          if (task === 1) {
            if (e.key === "Backspace") advance(2);
            else if (e.key === "Enter") setMessage({ kind: "hint", text: t("wrongKey", { key: "Backspace" }) });
          } else if (task === 2) {
            if (e.key === "Enter") advance(3);
            else if (e.key === "Backspace") setMessage({ kind: "hint", text: t("wrongKey", { key: "Enter" }) });
          } else if (task === 0 && e.key === "Enter") {
            setMessage({ kind: "hint", text: t("typeHint") });
          }
        }}
        className="mt-2 block w-full max-w-xl rounded-md border-2 border-ink bg-white px-4 py-3 font-body text-2xl"
      />
      {task === 0 && (
        <div className="mt-4">
          <Button
            variant={value.trim().length >= 2 ? "primary" : "secondary"}
            onClick={() =>
              value.trim().length >= 2 ? advance(1) : setMessage({ kind: "hint", text: t("typeHint") })
            }
          >
            {tp("nextTask")}
          </Button>
        </div>
      )}
    </PracticeShell>
  );
}

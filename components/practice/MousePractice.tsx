"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PracticeShell from "./PracticeShell";
import { Flower } from "../illustrations/Drawings";
import { ClickTask, DoubleClickTask, DragTask, ScrollTask } from "../learn/Skills";

type Message = { kind: "success" | "hint"; text: string } | null;

/** Click, double-click, drag and scroll — four small tasks with no wrong answers, only hints. */
export default function MousePractice({ onDone }: { onDone: () => void }) {
  const t = useTranslations("mouse");
  const tp = useTranslations("practice");
  const [task, setTask] = useState(0);
  const [message, setMessage] = useState<Message>(null);
  const [round, setRound] = useState(0);

  const next = () => {
    setMessage({ kind: "success", text: tp("wellDone") });
    if (task === 3) onDone();
    setTask(task + 1);
  };
  const hint = (text: string) => setMessage({ kind: "hint", text });

  const tasks = [
    { title: t("clickTitle"), help: t("clickHelp") },
    { title: t("dblTitle"), help: t("dblHelp") },
    { title: t("dragTitle"), help: t("dragHelp") },
    { title: t("scrollTitle"), help: t("scrollHelp") },
  ];
  const current = tasks[Math.min(task, 3)];

  return (
    <PracticeShell
      task={task}
      total={4}
      title={current.title}
      help={current.help}
      message={message}
      done={task > 3}
      doneText={t("allDone")}
      onRestart={() => {
        setTask(0);
        setMessage(null);
        setRound(round + 1);
      }}
    >
      <div key={`${task}-${round}`}>
        {task === 0 && <ClickTask onDone={next} />}
        {task === 1 && <DoubleClickTask onDone={next} onHint={hint} />}
        {task === 2 && <DragTask onDone={next} onHint={hint} />}
        {task === 3 && <ScrollTask onDone={next} />}
        {task > 3 && (
          <div className="flex h-56 items-center justify-center">
            <Flower className="h-48 text-ink" />
          </div>
        )}
      </div>
    </PracticeShell>
  );
}

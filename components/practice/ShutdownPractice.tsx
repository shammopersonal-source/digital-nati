"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PracticeShell from "./PracticeShell";

type Message = { kind: "success" | "hint"; text: string } | null;

function StartLogo() {
  return (
    <span aria-hidden="true" className="grid grid-cols-2 gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-3 w-3 border-2 border-ink bg-green-wash" />
      ))}
    </span>
  );
}

function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
      <path d="M7 6.5a8 8 0 1 0 10 0M12 3v8" />
    </svg>
  );
}

/** A practice screen: Start → Power → Shut down. */
export default function ShutdownPractice({ onDone }: { onDone: () => void }) {
  const t = useTranslations("shutdown");
  const tp = useTranslations("practice");
  const [menu, setMenu] = useState(false);
  const [power, setPower] = useState(false);
  const [off, setOff] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const task = off ? 3 : power ? 2 : menu ? 1 : 0;
  const tasks = [
    { title: t("startTitle"), help: t("startHelp") },
    { title: t("powerTitle"), help: t("powerHelp") },
    { title: t("shutTitle"), help: t("shutHelp") },
  ];
  const current = tasks[Math.min(task, 2)];
  const well = () => setMessage({ kind: "success", text: tp("wellDone") });
  const hint = (text: string) => setMessage({ kind: "hint", text });

  const item = "flex min-h-[2.8rem] w-full items-center gap-3 rounded-sm px-3 text-left text-lg hover:bg-select";

  return (
    <PracticeShell
      task={task}
      total={3}
      title={current.title}
      help={current.help}
      message={message}
      done={off || done}
      doneText={t("allDone")}
      onRestart={() => {
        setMenu(false);
        setPower(false);
        setOff(false);
        setDone(false);
        setMessage(null);
      }}
    >
      <div
        role="group"
        aria-label={t("screenLabel")}
        className="relative flex aspect-[16/11] max-h-[24rem] w-full flex-col overflow-hidden rounded-sm border-2 border-ink sm:aspect-[16/9]"
      >
        {off ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-ink p-4 text-center text-white">
            <p className="text-xl font-bold">{t("isOff")}</p>
            <button
              type="button"
              onClick={() => {
                setOff(false);
                setMenu(false);
                setPower(false);
                setDone(true);
              }}
              className="inline-flex min-h-[2.8rem] items-center rounded-md border-2 border-white px-4 text-lg font-bold hover:bg-ink-soft"
            >
              {t("turnOn")}
            </button>
          </div>
        ) : (
          <>
            <div
              className="relative flex-1 bg-green-wash p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget && !done) hint(t("wrongPlace"));
                if (e.target === e.currentTarget) {
                  setMenu(false);
                  setPower(false);
                }
              }}
            >
              <div className="pointer-events-none flex w-20 flex-col items-center gap-1 text-center">
                <span className="h-12 w-10 border-2 border-ink bg-white" />
                <span className="font-bold leading-tight">{t("desktopFile")}</span>
              </div>

              {menu && (
                <div className="absolute bottom-2 left-1/2 w-[min(20rem,90%)] -translate-x-1/2 rounded-md border-2 border-ink bg-white p-3">
                  <ul className="space-y-1" aria-hidden={power}>
                    {["Word", "Excel", "Chrome"].map((app) => (
                      <li key={app}>
                        <button type="button" className={item} onClick={() => hint(t("powerHelp"))}>
                          <span className="h-5 w-5 border-2 border-ink bg-paper-deep" />
                          {app}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-end border-t-2 border-line-soft pt-2">
                    <button
                      type="button"
                      aria-expanded={power}
                      onClick={() => {
                        setPower(true);
                        well();
                      }}
                      className="inline-flex min-h-[2.8rem] items-center gap-2 rounded-sm px-3 text-lg font-bold hover:bg-select"
                    >
                      <PowerIcon />
                      {t("power")}
                    </button>
                  </div>
                  {power && (
                    <ul className="absolute bottom-14 right-3 w-48 rounded-md border-2 border-ink bg-white p-2">
                      <li>
                        <button type="button" className={item} onClick={() => hint(t("sleepHint"))}>
                          {t("sleep")}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`${item} font-bold`}
                          onClick={() => {
                            setOff(true);
                            setMessage(null);
                            onDone();
                          }}
                        >
                          {t("shutDown")}
                        </button>
                      </li>
                      <li>
                        <button type="button" className={item} onClick={() => hint(t("restartHint"))}>
                          {t("restart")}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex h-14 items-center justify-center gap-3 border-t-2 border-ink bg-paper-deep">
              <button
                type="button"
                aria-expanded={menu}
                onClick={() => {
                  if (!menu) well();
                  setMenu(!menu);
                  setPower(false);
                }}
                className={`inline-flex min-h-[2.8rem] items-center gap-2 rounded-sm px-3 font-bold hover:bg-select ${menu ? "bg-select" : ""}`}
              >
                <StartLogo />
                {t("start")}
              </button>
              <span aria-hidden="true" className="h-7 w-7 border-2 border-ink bg-white" />
              <span aria-hidden="true" className="h-7 w-7 border-2 border-ink bg-white" />
            </div>
          </>
        )}
      </div>
    </PracticeShell>
  );
}

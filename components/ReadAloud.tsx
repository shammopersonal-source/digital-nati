"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAppData } from "@/lib/storage";
import Icon from "./Icon";

/** "Read aloud" button. Only shown when the learner turned it on in the reading settings. */
export default function ReadAloud({ text }: { text: string }) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const { settings } = useAppData();
  const [speaking, setSpeaking] = useState(false);
  const [noVoice, setNoVoice] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!settings.readAloud) return null;

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setNoVoice(true);
      return;
    }
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const lang = locale === "bn" ? "bn" : "en";
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
    if (!voice && lang === "bn") {
      setNoVoice(true);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-GB";
    u.rate = 0.85;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  };

  return (
    <div className="no-print">
      <button
        type="button"
        onClick={speak}
        className="inline-flex min-h-[2.8rem] items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep"
      >
        <Icon name={speaking ? "stop" : "speaker"} />
        {speaking ? t("stopReading") : t("readAloud")}
      </button>
      {noVoice && <p className="mt-2 max-w-prose rounded-sm bg-marigold-wash p-3">{t("noVoice")}</p>}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Icon from "./Icon";

type Props = {
  src?: string;
  poster?: string;
  /** .vtt subtitle files by language. */
  captions?: Partial<Record<string, string>>;
  placeholderKey?: "placeholder" | "placeholderHelp";
};

const speeds = [
  { rate: 0.75, key: "slower" },
  { rate: 1, key: "normal" },
  { rate: 1.25, key: "faster" },
] as const;

/**
 * A simple video player: one big play button, replay 10 seconds, three speeds
 * and subtitles. Never plays by itself. Without a `src` it shows a calm
 * "being recorded" note instead.
 */
export default function VideoPlayer({ src, poster, captions = {}, placeholderKey = "placeholder" }: Props) {
  const t = useTranslations("video");
  const locale = useLocale();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [subtitles, setSubtitles] = useState(true);

  if (!src) {
    return (
      <div className="flex items-start gap-4 rounded-md border-2 border-dashed border-ink bg-white p-5">
        <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper-deep">
          <Icon name="play" className="h-6 w-6" />
        </span>
        <p className="text-lg">{t(placeholderKey)}</p>
      </div>
    );
  }

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const setTrack = (on: boolean) => {
    setSubtitles(on);
    const tracks = ref.current?.textTracks;
    if (!tracks) return;
    for (const track of Array.from(tracks)) {
      track.mode = on && track.language === locale ? "showing" : "disabled";
    }
  };

  return (
    <figure className="rounded-md border-2 border-ink bg-white">
      <div className="relative bg-ink">
        <video
          ref={ref}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          className="block aspect-video w-full"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onLoadedMetadata={() => setTrack(subtitles)}
          onClick={toggle}
        >
          {Object.entries(captions).map(([lang, file]) => (
            <track key={lang} kind="captions" src={file} srcLang={lang} label={lang} default={lang === locale} />
          ))}
        </video>
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 m-auto flex h-fit w-fit items-center gap-3 rounded-md border-2 border-white bg-green px-7 py-4 text-xl font-bold text-white"
          >
            <Icon name="play" className="h-8 w-8" />
            {t("play")}
          </button>
        )}
      </div>
      <figcaption className="sr-only">{t("label")}</figcaption>

      <div className="flex flex-wrap items-center gap-3 border-t-2 border-ink p-3">
        <button type="button" onClick={toggle} className={controlClass}>
          <Icon name={playing ? "pause" : "play"} />
          {playing ? t("pause") : t("play")}
        </button>
        <button
          type="button"
          onClick={() => {
            if (ref.current) ref.current.currentTime = Math.max(0, ref.current.currentTime - 10);
          }}
          className={controlClass}
        >
          <Icon name="replay" />
          {t("replay")}
        </button>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{t("speed")}</legend>
          <span aria-hidden="true" className="font-bold">
            {t("speed")}:
          </span>
          {speeds.map((s) => (
            <label key={s.rate} className={`${controlClass} cursor-pointer has-[:checked]:bg-ink has-[:checked]:text-white`}>
              <input
                type="radio"
                name="speed"
                className="sr-only"
                checked={rate === s.rate}
                onChange={() => {
                  setRate(s.rate);
                  if (ref.current) ref.current.playbackRate = s.rate;
                }}
              />
              {t(s.key)} ({s.rate}×)
            </label>
          ))}
        </fieldset>

        {Object.keys(captions).length > 0 && (
          <label className={`${controlClass} cursor-pointer`}>
            <input type="checkbox" className="h-5 w-5" checked={subtitles} onChange={(e) => setTrack(e.target.checked)} />
            {t("captions")}
          </label>
        )}
      </div>
    </figure>
  );
}

const controlClass =
  "inline-flex min-h-[2.8rem] items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep has-[:focus-visible]:outline has-[:focus-visible]:outline-3";

"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Lesson text with glossary words. "[[click]]" becomes the word "click" with a
 * dotted underline; tapping it shows what it means right there in the sentence.
 */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[a-zA-Z]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([a-zA-Z]+)\]\]$/);
        return m ? <Term key={i} term={m[1]} /> : <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Plain text with the [[markers]] replaced by the word, for reading aloud and printing. */
export function usePlainText() {
  const t = useTranslations("glossary");
  return (text: string) => text.replace(/\[\[([a-zA-Z]+)\]\]/g, (_, key: string) => t(`${key}.word`));
}

function Term({ term }: { term: string }) {
  const t = useTranslations("glossary");
  const [open, setOpen] = useState(false);
  const word = t(`${term}.word`);
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        title={t("show", { word })}
        onClick={() => setOpen((o) => !o)}
        className="cursor-help rounded-sm px-0.5 py-1 font-bold underline decoration-ink decoration-dotted decoration-2 underline-offset-[0.3em] hover:bg-marigold-wash"
      >
        {word}
      </button>
      {open && (
        <span className="mx-1 rounded-sm bg-marigold-wash px-2 py-0.5" role="note">
          ({t(`${term}.meaning`)})
        </span>
      )}
    </>
  );
}

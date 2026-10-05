"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import Icon from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** A calm, accessible pop-up window built on the native <dialog> element. */
export default function Dialog({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = useTranslations("common");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the dark area outside the box closes it.
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className="m-auto max-h-[90vh] w-[min(36rem,calc(100vw-1.5rem))] overflow-y-auto rounded-md border-2 border-ink bg-paper p-0 text-ink"
    >
      <div className="flex items-start justify-between gap-4 border-b-2 border-ink px-5 py-4">
        <h2 id="dialog-title" className="pt-1 text-2xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[2.8rem] shrink-0 items-center gap-2 rounded-md border-2 border-ink bg-white px-4 text-lg font-bold hover:bg-paper-deep"
        >
          <Icon name="close" className="h-5 w-5" />
          {t("close")}
        </button>
      </div>
      <div className="px-5 py-5">{children}</div>
    </dialog>
  );
}

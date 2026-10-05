"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappShareLink } from "@/lib/site";
import Dialog from "./Dialog";
import ContactButtons from "./ContactButtons";
import VideoPlayer from "./VideoPlayer";
import { ButtonAnchor } from "./Button";
import Icon from "./Icon";

/** The "Need help?" button that is always in the bottom-right corner. */
export default function HelpButton() {
  const t = useTranslations("help");
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShareUrl(window.location.href);
          setOpen(true);
        }}
        className="no-print fixed bottom-4 right-4 z-40 inline-flex min-h-[3.2rem] items-center gap-3 rounded-md border-2 border-ink bg-marigold px-5 text-lg font-bold text-ink hover:bg-marigold-wash sm:bottom-6 sm:right-6"
      >
        <Icon name="question" className="h-7 w-7" />
        {t("button")}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title={t("title")}>
        <p className="text-lg">{t("intro")}</p>
        <div className="mt-5">
          <ContactButtons compact />
        </div>

        <h3 className="mt-8">{t("videoTitle")}</h3>
        <div className="mt-3">
          <VideoPlayer placeholderKey="placeholderHelp" />
        </div>

        <div className="mt-8 flex flex-col items-start gap-2">
          <ButtonAnchor
            href={whatsappShareLink(t("shareMessage", { url: shareUrl }))}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            <Icon name="share" />
            {t("share")}
          </ButtonAnchor>
          <Link
            href="/help"
            onClick={() => setOpen(false)}
            className="text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold"
          >
            {t("more")}
          </Link>
        </div>
      </Dialog>
    </>
  );
}

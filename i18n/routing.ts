import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bn", "en"],
  defaultLocale: "bn",
  // Bangla lives at "/", English at "/en". We don't guess from the browser:
  // Bangla is always the starting language, and the switch is in the header.
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

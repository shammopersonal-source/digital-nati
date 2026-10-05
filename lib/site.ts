// Facts about the people behind Digital Nati. Change them here and they change everywhere.

export type Phone = {
  /** How the number is written for people. */
  display: string;
  /** International format without "+" — used for tel: and WhatsApp links. */
  international: string;
};

export const phones: Phone[] = [
  { display: "01819-827310", international: "8801819827310" },
  { display: "01716-096269", international: "8801716096269" },
];

export const telLink = (p: Phone) => `tel:+${p.international}`;

export const whatsappLink = (p: Phone, text?: string) =>
  `https://wa.me/${p.international}` +
  (text ? `?text=${encodeURIComponent(text)}` : "");

/** Opens WhatsApp so the user can pick who to send `text` to. */
export const whatsappShareLink = (text: string) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

export const karjoUrl = "https://karjo.co.uk";

// TODO: add the KARJO Prime website address. The footer shows the link once this is set.
export const karjoPrimeUrl: string | null = null;

// TODO: add the founder's name when we want to show it on the site.
export const founderName = "[Founder name]";

// Mock phone + one-time-code login.
//
// Nothing is sent anywhere yet: any 6-digit code is accepted. To make it real,
// replace these two functions with calls to an SMS/OTP service (for example
// Supabase Auth phone login, Firebase phone auth, or a local SMS gateway).
// The sign-up and log-in pages only use these two functions.

export const MOCK_OTP = true;

export async function sendCode(phone: string): Promise<void> {
  void phone;
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  void phone;
  return /^\d{6}$/.test(code);
}

/** Bangladeshi mobile numbers: 11 digits starting with 01. Spaces and dashes are fine. */
export function normalisePhone(input: string): string | null {
  const digits = toLatinDigits(input).replace(/[^\d]/g, "").replace(/^(?:880|0088)/, "0");
  return /^01\d{9}$/.test(digits) ? digits : null;
}

export function formatPhone(digits: string): string {
  return digits.length === 11 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

/** People may type numbers with Bangla digits (০১২…); accept them. */
export function toLatinDigits(s: string): string {
  return s.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6));
}

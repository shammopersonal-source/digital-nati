// Reading text aloud. A recorded file is used when there is one; otherwise the
// computer's own voice. Many computers have no Bangla voice, so callers get
// `false` back and can say so kindly.

let current: { stop: () => void } | null = null;

function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", done, { once: true });
    window.setTimeout(done, 1200);
  });
}

export function stopSpeaking() {
  current?.stop();
  current = null;
}

export async function speak(text: string, locale: string, audioSrc?: string): Promise<boolean> {
  stopSpeaking();
  if (audioSrc) {
    const audio = new Audio(audioSrc);
    current = { stop: () => audio.pause() };
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }
  if (!("speechSynthesis" in window)) return false;
  const lang = locale === "bn" ? "bn" : "en";
  const voice = (await voicesReady()).find((v) => v.lang.toLowerCase().startsWith(lang));
  if (!voice && lang === "bn") return false;
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "en-GB";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  current = { stop: () => window.speechSynthesis.cancel() };
  return true;
}

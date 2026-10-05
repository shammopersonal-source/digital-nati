# Digital Nati

Free, patient computer lessons for older people in Bangladesh: the mouse, the keyboard, Word, Excel, PowerPoint, email and staying safe online. "Nati" means grandchild. The site should feel like a patient grandchild sitting beside you.

Digital Nati is an initiative of [KARJO](https://karjo.co.uk).

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

It deploys on Vercel with no configuration: import the repository and press Deploy.

## How it is built

- **Next.js (App Router) + TypeScript + Tailwind CSS v4.**
- **Two languages** with `next-intl`. Bangla is the default and lives at `/`. English lives at `/en`. The site never guesses a language from the browser; the switch is in the header.
- **No backend yet.** Login is mocked, and progress is saved in the browser's `localStorage`.
- **Every page is static**, which keeps it fast on slow connections. Saved progress is read in the browser.

```
app/[locale]/(site)/     Ordinary pages with the menu: home, learning path (/learn), practice (/practice),
                         my-learning, certificate, help, families, settings, signup, login
app/[locale]/(focus)/    Lessons (/learn/[chapter]/[lesson]) and brush-up (/review): no menu, nothing to distract
components/learn/        The learning engine: LessonPlayer, the exercise screens (Exercises.tsx), tappable
                         mouse/keyboard pictures, on-screen keyboard, skill tasks, PathView, GoalSummary
components/practice/     Free practice exercises (mouse board, typing, shut-down screen, pretend Word)
components/illustrations Hand-drawn style SVG drawings (including Nati, the guide) and real photos (Photos.tsx)
content/path.ts          The learning path: chapters → lessons → exercises, in both languages
messages/bn.json, en.json  Every piece of interface text
lib/storage.ts           The only place that reads or writes saved data
lib/speech.ts            Reading aloud (recorded audio if there is some, else the computer's voice)
lib/auth.ts              Mock phone + one-time-code login
lib/site.ts              Phone numbers, KARJO and KARJO Prime links, founder name
i18n/                    Language routing (next-intl)
proxy.ts                 Sends "/" to Bangla and "/en/…" to English
```

### How learning works (like Duolingo, but gentle)

- **The learning path** (`/learn`) is one winding road of lessons, grouped into chapters. The next lesson glows: "Start here". Nothing is locked; skipping ahead only shows a kind note.
- **A lesson** is 5–10 small screens. Nati, the guide, says what to do in a speech bubble (with a "Listen" button), and the learner answers. Screen types: something new (`learn`), pick one (`choice`, words or pictures), tap the right part of a mouse/keyboard picture (`tap`), match the pairs (`match`), put steps in order (`order`), type (`type`, with an on-screen keyboard that lights up the next key) and do it for real (`do`: click, double-click, drag, scroll, Backspace, Enter).
- **Feedback is kind and grows step by step:** first wrong try → "Almost!" and a hint; second → the right answer is shown and the question comes back later in the lesson. "Show me" circles what to do. A "do" task can be skipped. No hearts, no timers, no scores.
- **Gentle rewards:** a daily goal (5, 10 or 15 minutes), the days learned this week (Saturday to Friday), and a certificate for each finished chapter. No streak that breaks, no leaderboards.
- **Brush-up** (`/review`) brings back what the learner got wrong first, then mixes in other questions from finished lessons.
- **Easier mouse** (in the "Aa" settings): slower double-clicks count, and dragging works by click to pick up, click to put down.


### Design rules

These rules are built into the code. Please keep them.

- **Text size.** The root font size is 20px, so `1rem` is 20px. Tailwind's `text-xs` and `text-sm` are removed on purpose. The smallest size is `text-small` (18px).
- **Buttons and links.** Every standalone button or link is at least `min-h-[2.8rem]` (56px) tall.
- **Colours.** These are tokens in `app/globals.css`: paper `#FAF7F0`, ink `#1F2A2E`, bottle green `#1E5B4F`, and marigold `#E0A526` (highlights only, never text). Brick red is used for errors only. Body text meets WCAG AAA contrast. There are no gradients and no shadows.
- **Fonts.** English uses Atkinson Hyperlegible for body text and Source Serif 4 for headings. Bangla uses Hind Siliguri for body text and Tiro Bangla for headings. Handwritten notes use Kalam and Galada. All are self-hosted through `next/font`.
- **Nothing moves on its own.** There is no autoplay, no carousels and no pop-ups on load. `prefers-reduced-motion` is respected.
- **One primary button per screen.** Everything else is a secondary button or a text link.
- **Reading settings.** The "Aa Text size" control (Normal / Large / Extra large, stronger colours, read aloud) is saved. An inline script in `<head>` applies it before the first paint.

## Adding a lesson

Open `content/path.ts`, find the chapter, and give the lesson an `exercises` list. A lesson without exercises shows as "coming soon".

```ts
{
  id: "desktop",
  minutes: 4,
  title: { bn: "ডেস্কটপ আর আইকন", en: "The desktop and icons" },
  exercises: [
    { kind: "learn", figure: "start-button", text: { bn: "…", en: "This is the [[desktop]]…" } },
    {
      kind: "choice",
      prompt: { bn: "…", en: "Which one opens the Start menu?" },
      options: [
        { text: { bn: "…", en: "The sign with four squares" }, correct: true },
        { text: { bn: "…", en: "The clock" }, hint: { bn: "…", en: "A gentle nudge, never a telling-off." } },
      ],
      explain: { bn: "…", en: "Shown with the right answer after a second wrong try." },
    },
    { kind: "tap", on: "keyboard", answer: "enter", prompt: { bn: "…", en: "Touch the Enter key." } },
    { kind: "match", prompt: { bn: "জোড়া মেলান", en: "Match the pairs" }, pairs: [{ left: { bn: "Save", en: "Save" }, right: { bn: "রেখে দিন", en: "Keep it" } }] },
    { kind: "order", prompt: { bn: "…", en: "Put the steps in order." }, steps: [/* written in the right order */] },
    { kind: "type", prompt: { bn: "লিখুন: ami", en: "Type: tea" }, answer: { bn: "ami", en: "tea" } },
    { kind: "do", skill: "doubleClick", prompt: { bn: "…", en: "Double-click the folder." } },
  ],
}
```

- Keep lessons short: 5–10 screens, and start new ideas with a `learn` screen.
- `[[word]]` marks a word from `glossary` in `messages/*.json`. It gets a dotted underline and explains itself when tapped. Add new words to both message files.
- **Voice.** Add `audio: { bn: "/audio/desktop-1.mp3", en: "…" }` to any screen to use a recorded voice (put files in `public/audio/`). Without it, the computer's own voice is used; many computers have no Bangla voice, so recorded audio is much better.
- **A chapter video** (optional): set `video` on the chapter.
- **New kinds of screen or practice:** exercise screens live in `components/learn/Exercises.tsx` (plus `isCorrect` for checkable ones). Free practice exercises are registered in `components/practice/index.tsx`.
- Write in plain, spoken language at about a Class 6 reading level. In Bangla, always use আপনি.

## Adding real photos and screenshots

The real things on a learner's desk (mouse, keyboard, monitor, printer) are shown as **real photos** from Wikimedia Commons, in `public/photos/` (`components/illustrations/Photos.tsx`). Every photo needs a free licence and is listed in `public/photos/CREDITS.md` and `lib/photoCredits.ts`, which feed the "Photo credits" page (`/credits`, linked in the footer). Rings and tap areas on a photo are placed with percentages measured on that photo (`mouseBoxes`, `keyBoxes`): if you swap a photo, measure them again. Nati, the practice drawings and the screen pictures are still hand-drawn SVG (`components/illustrations/Drawings.tsx`). **Do not use stock photos or AI-generated people.**

- **Lesson pictures.** Put files in `public/screenshots/`. To use them on `learn` screens, add an `image` option next to `figure` in `content/path.ts` and render it in `LearnView` (`components/learn/Exercises.tsx`).
- **Learner photos and testimonials.** There is a commented-out section at the end of `app/[locale]/page.tsx`. Only add real quotes from real learners, with their permission. Never add made-up numbers or reviews.

## Plugging in a real backend

- **Login.** `lib/auth.ts` has `sendCode()` and `verifyCode()`. Replace them with a real SMS/OTP service, such as Supabase phone auth, Firebase phone auth or a local SMS gateway. Then set `MOCK_OTP = false` so the "test version" note disappears. The sign-up and login pages only call these two functions.
- **Progress and settings.** `lib/storage.ts` is the only file that knows where data lives. Keep its exported functions and change how `read` and `write` load and save data, for example to Supabase. The pages won't need to change.
- **Helper updates.** Today, learners send their progress to a family member over a WhatsApp link (`/my-learning`). Automatic messages would need a backend and the WhatsApp Business API.

## Things still to fill in

- Recorded Bangla voice lines for the lessons (see "Voice" above).
- Lessons for the chapters marked "coming soon" (Windows, files, internet safety, WhatsApp and email, Word, Excel, PowerPoint).
- The "How to use this website" video (in the help panel and on `/help`).

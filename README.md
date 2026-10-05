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
app/[locale]/            Pages (home, courses, lessons, my-learning, certificate, help, families, settings, signup, login)
components/              Shared pieces: Button, PageTop (back button + breadcrumb), HelpButton, ReadingSettings,
                         VideoPlayer, LessonView, Quiz, RichText (glossary words), CourseList, Dialog …
components/practice/     The "Try it" exercises: MousePractice, KeyboardPractice, ShutdownPractice, WordPractice
components/illustrations Hand-drawn style SVG drawings used instead of photos and screenshots
content/courses.ts       All courses and lessons, in both languages
messages/bn.json, en.json  Every piece of interface text
lib/storage.ts           The only place that reads or writes saved data
lib/auth.ts              Mock phone + one-time-code login
lib/site.ts              Phone numbers, KARJO links, founder name (Ali Zawad)
i18n/                    Language routing (next-intl)
proxy.ts                 Sends "/" to Bangla and "/en/…" to English
```

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

1. Open `content/courses.ts` and find the course.
2. Add a `content` object to the lesson. A lesson without `content` shows as "coming soon":

```ts
{
  id: "open-letter",
  minutes: 4,
  title: { bn: "…", en: "Opening a saved letter" },
  content: {
    summary: { bn: "…", en: "…" },
    video: { src: "/videos/open-letter.mp4", captions: { bn: "/videos/open-letter.bn.vtt", en: "/videos/open-letter.en.vtt" } },
    steps: [
      { text: { bn: "…", en: "[[doubleClick]] on your letter to open it." }, figure: "word-save" },
      { text: { bn: "…", en: "…" }, image: { src: "/screenshots/open.png", alt: { bn: "…", en: "…" } } },
    ],
    tip: { bn: "…", en: "…" },
    practice: "word",
    quiz: [
      {
        question: { bn: "…", en: "…" },
        options: [
          { text: { bn: "…", en: "…" }, correct: true },
          { text: { bn: "…", en: "…" }, hint: { bn: "…", en: "A gentle nudge, never a telling-off." } },
        ],
      },
    ],
  },
}
```

- **Glossary words.** `[[word]]` marks a word from `glossary` in `messages/*.json`. It gets a dotted underline and explains itself when tapped. Only mark the first time a word appears in a lesson. To add a new word, add it to both message files.
- **Videos.** Put them in `public/videos/`. Keep each one 2 to 5 minutes, recorded on a real screen, and always add `.vtt` captions. Without a `video`, the lesson shows a calm "being recorded" note.
- **Practice.** `practice` picks one of the exercises in `components/practice/`. To add a new kind, build a component that takes `onDone`, add its name to the `Practice` type, and register it in `components/LessonView.tsx`.
- Write in plain, spoken language at about a Class 6 reading level. In Bangla, always use আপনি.

## Adding real photos and screenshots

We have no real photos yet, so the site uses hand-drawn style SVG drawings (`components/illustrations/Drawings.tsx`). **Do not use stock photos or AI-generated people.**

- **Lesson screenshots.** Put files in `public/screenshots/` and set `image: { src, alt }` on the step. The screenshot replaces the drawing. Mark the important button with a circle or arrow on the image itself.
- **Course pictures.** Set `screenshot: "/screenshots/word.png"` on a course in `content/courses.ts`.
- **Learner photos and testimonials.** There is a commented-out section at the end of `app/[locale]/page.tsx`. Only add real quotes from real learners, with their permission. Never add made-up numbers or reviews.

## Plugging in a real backend

- **Login.** `lib/auth.ts` has `sendCode()` and `verifyCode()`. Replace them with a real SMS/OTP service, such as Supabase phone auth, Firebase phone auth or a local SMS gateway. Then set `MOCK_OTP = false` so the "test version" note disappears. The sign-up and login pages only call these two functions.
- **Progress and settings.** `lib/storage.ts` is the only file that knows where data lives. Keep its exported functions and change how `read` and `write` load and save data, for example to Supabase. The pages won't need to change.
- **Helper updates.** Today, learners send their progress to a family member over a WhatsApp link (`/my-learning`). Automatic messages would need a backend and the WhatsApp Business API.

## Things still to fill in

- `lib/site.ts`: `karjoPrimeUrl` (the footer link appears once this is set).
- Lesson videos and captions, and the "How to use this website" video (in the help panel and on `/help`).
- Lesson content for the courses marked "coming soon".

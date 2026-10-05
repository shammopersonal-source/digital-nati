// All courses and lessons live here. See README.md → "Adding a lesson".
//
// Text is written in both languages: { bn: "...", en: "..." }.
// Inside lesson text, [[word]] marks a word from the glossary (messages/*.json →
// "glossary"). It is shown with a dotted underline and explains itself when tapped.
// Only mark the first time a word appears in a lesson.

import type { Locale } from "@/i18n/routing";

export type Text = Record<Locale, string>;

export const pick = (text: Text, locale: string) =>
  text[locale as Locale] ?? text.bn;

/** Drawn diagrams used in the "Read" step. Replace with real screenshots via `image`. */
export type Figure =
  | "mouse-hand"
  | "mouse-left"
  | "mouse-wheel"
  | "keyboard-backspace"
  | "keyboard-space"
  | "keyboard-enter"
  | "keyboard-shift"
  | "start-button"
  | "power-menu"
  | "word-bold"
  | "word-bigger"
  | "word-save";

export type Practice = "mouse" | "keyboard" | "shutdown" | "word";

export type LessonStep = {
  text: Text;
  /** A drawn diagram with the important button circled. */
  figure?: Figure;
  /** A real screenshot in /public/screenshots, e.g. "/screenshots/word-bold.png". Shown instead of `figure`. */
  image?: { src: string; alt: Text };
};

export type QuizOption = {
  text: Text;
  correct?: boolean;
  /** Shown when this wrong answer is picked. A gentle nudge, never a telling-off. */
  hint?: Text;
};

export type QuizQuestion = {
  question: Text;
  options: QuizOption[];
};

export type LessonContent = {
  summary: Text;
  video?: {
    /** e.g. "/videos/mouse.mp4" */
    src: string;
    poster?: string;
    captions: Partial<Record<Locale, string>>; // .vtt files
  };
  steps: LessonStep[];
  tip?: Text;
  practice: Practice;
  quiz: QuizQuestion[];
};

export type Lesson = {
  id: string;
  title: Text;
  minutes: number;
  /** Lessons without content are listed as "coming soon". */
  content?: LessonContent;
};

export type AppKind =
  | "computer"
  | "files"
  | "internet"
  | "email"
  | "word"
  | "excel"
  | "powerpoint";

export type Course = {
  id: string;
  title: Text;
  description: Text;
  /** Which drawn app picture to show. */
  app: AppKind;
  /** A real screenshot to show instead of the drawing, e.g. "/screenshots/word.png". */
  screenshot?: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    id: "computer-basics",
    app: "computer",
    title: {
      bn: "কম্পিউটারের সাথে পরিচয়",
      en: "Getting to know the computer",
    },
    description: {
      bn: "মাউস আর কিবোর্ড ব্যবহার, আর কম্পিউটার নিরাপদে বন্ধ করা।",
      en: "Using the mouse and keyboard, and turning the computer off safely.",
    },
    lessons: [
      {
        id: "mouse",
        minutes: 5,
        title: { bn: "মাউস ধরা ও ব্যবহার করা", en: "Holding and using the mouse" },
        content: {
          summary: {
            bn: "মাউস দিয়ে স্ক্রিনের ছোট তীরচিহ্নটি নড়ানো হয়। এই পাঠে আপনি মাউস ধরা, ক্লিক, ডাবল-ক্লিক, ড্র্যাগ আর স্ক্রল করা শিখবেন।",
            en: "The mouse moves the small arrow on the screen. In this lesson you will learn to hold it, click, double-click, drag and scroll.",
          },
          steps: [
            {
              figure: "mouse-hand",
              text: {
                bn: "মাউসের ওপর হাতটি আলতো করে রাখুন। তর্জনী থাকবে বাঁ বোতামে, মধ্যমা থাকবে ডান বোতামে।",
                en: "Rest your hand gently on the mouse. Your first finger sits on the left button, your middle finger on the right button.",
              },
            },
            {
              text: {
                bn: "টেবিলের ওপর মাউসটি আস্তে সরান। দেখুন, স্ক্রিনের ছোট তীরচিহ্ন — অর্থাৎ [[cursor]] — নড়ছে।",
                en: "Slide the mouse slowly on the table. Watch the small arrow — the [[cursor]] — move on the screen.",
              },
            },
            {
              figure: "mouse-left",
              text: {
                bn: "[[click]] করতে বাঁ বোতাম একবার চেপে ছেড়ে দিন। কোনো কিছু বেছে নিতে এটি লাগে।",
                en: "To [[click]], press the left button once and let go. You use this to choose something.",
              },
            },
            {
              text: {
                bn: "[[doubleClick]] করতে বাঁ বোতাম দ্রুত দুইবার চাপুন। ফোল্ডার খুলতে এটি লাগে।",
                en: "To [[doubleClick]], press the left button twice, quickly. You use this to open a folder.",
              },
            },
            {
              text: {
                bn: "[[drag]] করতে বাঁ বোতাম চেপে ধরে মাউস সরান, তারপর ছেড়ে দিন।",
                en: "To [[drag]], hold the left button down, move the mouse, then let go.",
              },
            },
            {
              figure: "mouse-wheel",
              text: {
                bn: "[[scroll]] করতে দুই বোতামের মাঝের ছোট চাকাটি ঘোরান। পাতা ওপরে-নিচে সরবে।",
                en: "To [[scroll]], turn the small wheel between the two buttons. The page moves up and down.",
              },
            },
          ],
          tip: {
            bn: "মাউস টেবিলের কিনারায় চলে গেলে সেটি তুলে আবার মাঝখানে রাখুন। তীরচিহ্ন যেখানে ছিল সেখানেই থাকবে।",
            en: "If the mouse reaches the edge of the table, lift it up and put it back in the middle. The arrow stays where it was.",
          },
          practice: "mouse",
          quiz: [
            {
              question: {
                bn: "বেশিরভাগ সময় মাউসের কোন বোতামটি চাপবেন?",
                en: "Which mouse button will you press most of the time?",
              },
              options: [
                { correct: true, text: { bn: "বাঁ দিকের বোতাম", en: "The left button" } },
                {
                  text: { bn: "ডান দিকের বোতাম", en: "The right button" },
                  hint: {
                    bn: "ডান বোতাম কম লাগে। বেশিরভাগ ক্লিক হয় বাঁ বোতামে। আবার চেষ্টা করুন।",
                    en: "The right button is used less often. Most clicks use the left one. Try again.",
                  },
                },
                {
                  text: { bn: "মাঝের চাকা", en: "The wheel in the middle" },
                  hint: {
                    bn: "চাকাটি পাতা ওপরে-নিচে সরানোর জন্য। আবার চেষ্টা করুন।",
                    en: "The wheel is for moving the page up and down. Try again.",
                  },
                },
              ],
            },
            {
              question: {
                bn: "একটি ফোল্ডার কীভাবে খোলেন?",
                en: "How do you open a folder?",
              },
              options: [
                {
                  text: { bn: "একবার ক্লিক করে", en: "Click once" },
                  hint: {
                    bn: "একবার ক্লিক করলে শুধু বেছে নেওয়া হয়। খুলতে হলে দ্রুত দুইবার ক্লিক করতে হয়।",
                    en: "One click only chooses it. To open it, you need two quick clicks.",
                  },
                },
                {
                  correct: true,
                  text: { bn: "দ্রুত দুইবার ক্লিক করে (ডাবল-ক্লিক)", en: "Two quick clicks (double-click)" },
                },
                {
                  text: { bn: "চাকা ঘুরিয়ে", en: "Turn the wheel" },
                  hint: {
                    bn: "চাকা ঘোরালে পাতা সরে, কিছু খোলে না। আবার চেষ্টা করুন।",
                    en: "Turning the wheel moves the page; it doesn't open anything. Try again.",
                  },
                },
              ],
            },
            {
              question: {
                bn: "মাউস টেবিলের কিনারায় চলে গেছে। কী করবেন?",
                en: "The mouse has reached the edge of the table. What do you do?",
              },
              options: [
                {
                  correct: true,
                  text: { bn: "মাউস তুলে আবার মাঝখানে রাখব", en: "Lift it and put it back in the middle" },
                },
                {
                  text: { bn: "থেমে যাব — আর সরানো যাবে না", en: "Stop — it can't go any further" },
                  hint: {
                    bn: "মাউস তুলে নেওয়া যায়। তীরচিহ্ন যেখানে আছে সেখানেই থাকে।",
                    en: "You can lift the mouse up. The arrow stays where it is.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "keyboard",
        minutes: 5,
        title: { bn: "কিবোর্ডে লেখা", en: "Typing on the keyboard" },
        content: {
          summary: {
            bn: "কিবোর্ড দিয়ে অক্ষর আর সংখ্যা লেখা হয়। আজ আপনি নিজের নাম লিখবেন, একটি অক্ষর মুছবেন আর Enter চাপবেন।",
            en: "The keyboard is for typing letters and numbers. Today you will type your name, rub out a letter and press Enter.",
          },
          steps: [
            {
              text: {
                bn: "যেখানে লিখতে চান সেখানে [[click]] করুন। সেখানে একটি সরু দাগ জ্বলবে-নিভবে — অক্ষরগুলো ওখানেই বসবে।",
                en: "[[click]] where you want to write. A thin line will blink there — that is where your letters will appear.",
              },
            },
            {
              text: {
                bn: "একবারে একটি বোতাম আলতো করে চাপুন। চেপে ধরে রাখতে হবে না।",
                en: "Press one key at a time, gently. You don't need to hold it down.",
              },
            },
            {
              figure: "keyboard-backspace",
              text: {
                bn: "ভুল হয়েছে? দাগের ঠিক আগের অক্ষরটি মুছতে একবার [[backspace]] চাপুন।",
                en: "Made a mistake? Press [[backspace]] once to rub out the letter just before the line.",
              },
            },
            {
              figure: "keyboard-space",
              text: {
                bn: "সবচেয়ে নিচের লম্বা বোতামটি হলো Space। এটি দুই শব্দের মাঝে ফাঁকা জায়গা দেয়।",
                en: "The long bar at the bottom is the Space bar. It puts a gap between words.",
              },
            },
            {
              figure: "keyboard-enter",
              text: {
                bn: "নতুন লাইন শুরু করতে, বা “হ্যাঁ, এগিয়ে যাও” বোঝাতে [[enter]] চাপুন।",
                en: "Press [[enter]] to start a new line, or to say “yes, go ahead”.",
              },
            },
            {
              figure: "keyboard-shift",
              text: {
                bn: "ইংরেজিতে বড় হাতের অক্ষর লিখতে Shift চেপে ধরে রেখে অক্ষরটি চাপুন।",
                en: "For a capital letter, hold Shift down and press the letter.",
              },
            },
          ],
          tip: {
            bn: "বাংলায় লিখতে কম্পিউটারে অভ্রর মতো একটি বাংলা লেখার প্রোগ্রাম লাগে। পরিবারের কেউ এটি চালু করে দিতে পারেন।",
            en: "To type in Bangla, the computer needs a Bangla typing program, such as Avro. A family member can set it up for you.",
          },
          practice: "keyboard",
          quiz: [
            {
              question: {
                bn: "কোন বোতাম চাপলে ভুল অক্ষর মুছে যায়?",
                en: "Which key rubs out a mistake?",
              },
              options: [
                { correct: true, text: { bn: "Backspace", en: "Backspace" } },
                {
                  text: { bn: "Enter", en: "Enter" },
                  hint: {
                    bn: "Enter চাপলে নতুন লাইন শুরু হয়। মোছার বোতাম হলো Backspace, ওপরে ডান দিকে।",
                    en: "Enter starts a new line. The key that rubs out is Backspace, at the top right.",
                  },
                },
                {
                  text: { bn: "Space", en: "Space" },
                  hint: {
                    bn: "Space ফাঁকা জায়গা দেয়, কিছু মোছে না। আবার চেষ্টা করুন।",
                    en: "Space adds a gap; it doesn't rub anything out. Try again.",
                  },
                },
              ],
            },
            {
              question: {
                bn: "লেখা শুরুর আগে প্রথমে কী করবেন?",
                en: "Before you start typing, what do you do first?",
              },
              options: [
                {
                  correct: true,
                  text: { bn: "যেখানে লিখব সেখানে ক্লিক করব", en: "Click where I want to write" },
                },
                {
                  text: { bn: "Enter চাপব", en: "Press Enter" },
                  hint: {
                    bn: "আগে ক্লিক করে কম্পিউটারকে দেখিয়ে দিন কোথায় লিখবেন।",
                    en: "First click, to show the computer where you want to write.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "turn-off",
        minutes: 4,
        title: {
          bn: "নিরাপদে কম্পিউটার বন্ধ করা",
          en: "Turning the computer off safely",
        },
        content: {
          summary: {
            bn: "কম্পিউটার বন্ধ করার ঠিক নিয়ম হলো Start মেনু থেকে বন্ধ করা। এতে আপনার কাজ নিরাপদ থাকে।",
            en: "The right way to turn a computer off is from the Start menu. This keeps your work safe.",
          },
          steps: [
            {
              text: {
                bn: "যে কাজগুলো খোলা আছে, আগে সেগুলো [[save]] করে বন্ধ করুন।",
                en: "First, [[save]] and close anything you are working on.",
              },
            },
            {
              figure: "start-button",
              text: {
                bn: "স্ক্রিনের একদম নিচে চার খোপের একটি চিহ্ন আছে — এটাই Start বোতাম। এতে [[click]] করুন।",
                en: "At the very bottom of the screen there is a small sign made of four squares — the Start button. [[click]] it.",
              },
            },
            {
              figure: "power-menu",
              text: {
                bn: "একটি তালিকা খুলবে। গোল দাগের ওপর ছোট দাঁড়ি দেওয়া চিহ্নটি হলো Power। এতে ক্লিক করুন।",
                en: "A list opens. The round sign with a small line on top is Power. Click it.",
              },
            },
            {
              text: {
                bn: "এবার “Shut down”-এ ক্লিক করুন। স্ক্রিন কালো হয়ে যাওয়া পর্যন্ত অপেক্ষা করুন।",
                en: "Now click “Shut down”. Wait until the screen goes dark.",
              },
            },
          ],
          tip: {
            bn: "পাওয়ার বোতাম চেপে ধরে বা প্লাগ খুলে বন্ধ করবেন না — শুধু কম্পিউটার আটকে গেলে এবং অন্য কোনো উপায় না থাকলে।",
            en: "Don't turn it off by holding the power button or pulling the plug — only if the computer is completely stuck and nothing else works.",
          },
          practice: "shutdown",
          quiz: [
            {
              question: {
                bn: "কম্পিউটার বন্ধ করার ঠিক নিয়ম কোনটি?",
                en: "What is the right way to turn the computer off?",
              },
              options: [
                {
                  correct: true,
                  text: { bn: "Start → Power → Shut down", en: "Start → Power → Shut down" },
                },
                {
                  text: { bn: "প্লাগ খুলে ফেলা", en: "Pull out the plug" },
                  hint: {
                    bn: "প্লাগ খুললে না-সেভ করা কাজ হারিয়ে যেতে পারে। Start মেনু থেকে বন্ধ করুন।",
                    en: "Pulling the plug can lose work that isn't saved. Use the Start menu instead.",
                  },
                },
              ],
            },
            {
              question: {
                bn: "বন্ধ করার আগে প্রথমে কী করবেন?",
                en: "What should you do before turning it off?",
              },
              options: [
                {
                  correct: true,
                  text: { bn: "খোলা কাজগুলো সেভ করে বন্ধ করব", en: "Save and close my work" },
                },
                {
                  text: { bn: "কিছুই না", en: "Nothing" },
                  hint: {
                    bn: "আগে কাজ সেভ করে নিলে কিছুই হারাবে না।",
                    en: "If you save your work first, nothing gets lost.",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "files",
    app: "files",
    title: { bn: "ফাইল ও ফোল্ডার", en: "Files and folders" },
    description: {
      bn: "আপনার কাজ কোথায় রাখা থাকে, আর কীভাবে আবার খুঁজে পাবেন।",
      en: "Where your work is kept, and how to find it again.",
    },
    lessons: [
      { id: "what-is-a-file", minutes: 4, title: { bn: "ফাইল কী?", en: "What is a file?" } },
      { id: "make-a-folder", minutes: 5, title: { bn: "নতুন ফোল্ডার বানানো", en: "Making a new folder" } },
      { id: "find-a-file", minutes: 5, title: { bn: "হারানো ফাইল খুঁজে পাওয়া", en: "Finding a lost file" } },
    ],
  },
  {
    id: "internet-safety",
    app: "internet",
    title: { bn: "নিরাপদে ইন্টারনেট ব্যবহার", en: "Using the internet safely" },
    description: {
      bn: "ওয়েবসাইট খোলা, কিছু খোঁজা, আর প্রতারণা ও ভুয়া ফোন চেনা।",
      en: "Opening websites, searching, and spotting scams and fake calls.",
    },
    lessons: [
      { id: "browser", minutes: 4, title: { bn: "ব্রাউজার কী?", en: "What is a browser?" } },
      { id: "search", minutes: 5, title: { bn: "Google-এ কিছু খোঁজা", en: "Searching on Google" } },
      {
        id: "fake-prizes",
        minutes: 5,
        title: { bn: "ভুয়া পুরস্কারের মেসেজ চেনা", en: "Spotting fake prize messages" },
      },
      {
        id: "fake-calls",
        minutes: 5,
        title: { bn: "ভুয়া বিকাশ ও নগদ কল চেনা", en: "Spotting fake bKash and Nagad calls" },
      },
    ],
  },
  {
    id: "email",
    app: "email",
    title: { bn: "ইমেইল", en: "Email" },
    description: {
      bn: "ইমেইল পড়া, লেখা আর পাঠানো।",
      en: "Reading, writing and sending emails.",
    },
    lessons: [
      { id: "read", minutes: 5, title: { bn: "ইমেইল পড়া", en: "Reading an email" } },
      { id: "write", minutes: 5, title: { bn: "ইমেইল লিখে পাঠানো", en: "Writing and sending an email" } },
      { id: "photo", minutes: 5, title: { bn: "ইমেইলে ছবি পাঠানো", en: "Sending a photo by email" } },
    ],
  },
  {
    id: "word",
    app: "word",
    title: { bn: "মাইক্রোসফট ওয়ার্ড", en: "Microsoft Word" },
    description: {
      bn: "চিঠি আর অন্যান্য লেখালেখির কাজ।",
      en: "Writing letters and other documents.",
    },
    lessons: [
      {
        id: "first-letter",
        minutes: 6,
        title: {
          bn: "আপনার প্রথম চিঠি: মোটা, বড় আর সেভ করা",
          en: "Your first letter: bold, bigger and saved",
        },
        content: {
          summary: {
            bn: "Word হলো চিঠি লেখার একটি প্রোগ্রাম। আজ আপনি একটি শব্দ বেছে নেবেন, সেটি মোটা আর বড় করবেন, তারপর চিঠিটি সেভ করবেন।",
            en: "Word is a program for writing letters. Today you will choose a word, make it bold and bigger, and then save your letter.",
          },
          steps: [
            {
              text: {
                bn: "Word খুলুন: স্ক্রিনের নিচের Start বোতামে [[click]] করুন, তারপর Word-এ ক্লিক করুন।",
                en: "Open Word: [[click]] the Start button at the bottom of the screen, then click Word.",
              },
            },
            {
              text: {
                bn: "“Blank document”-এ ক্লিক করুন। একটি সাদা পাতা আসবে। কয়েকটি শব্দ লিখুন।",
                en: "Click “Blank document”. A white page appears. Type a few words.",
              },
            },
            {
              text: {
                bn: "কোনো শব্দ বদলাতে আগে সেটি [[select]] করুন: শব্দটির ওপর ডাবল-ক্লিক করুন। শব্দটি নীল হয়ে যাবে।",
                en: "To change a word, first [[select]] it: double-click on the word. It turns blue.",
              },
            },
            {
              figure: "word-bold",
              text: {
                bn: "ওপরের [[ribbon]]-এ B বোতামে ক্লিক করুন। শব্দটি মোটা ও গাঢ় হয়ে যাবে।",
                en: "Click the B button on the [[ribbon]] at the top. The word becomes bold — thick and dark.",
              },
            },
            {
              figure: "word-bigger",
              text: {
                bn: "বড় করতে A▲ বোতামে ক্লিক করুন। প্রতিবার ক্লিকে অক্ষর একটু বড় হবে।",
                en: "To make it bigger, click the A▲ button. Each click makes the letters a little bigger.",
              },
            },
            {
              figure: "word-save",
              text: {
                bn: "[[save]] করতে একদম ওপরে বাঁ দিকের ছোট ডিস্কের ছবিতে ক্লিক করুন। চিঠির একটি নাম লিখে Save-এ ক্লিক করুন।",
                en: "To [[save]], click the small disk picture at the very top left. Type a name for your letter, then click Save.",
              },
            },
          ],
          tip: {
            bn: "শুধু শেষে নয়, মাঝে মাঝেই সেভ করুন। বিদ্যুৎ চলে গেলেও সেভ করা লেখা হারাবে না।",
            en: "Save often, not just at the end. If the electricity goes off, your saved work is safe.",
          },
          practice: "word",
          quiz: [
            {
              question: {
                bn: "কোনো শব্দ মোটা করার আগে কী করতে হয়?",
                en: "Before you make a word bold, what must you do?",
              },
              options: [
                {
                  correct: true,
                  text: {
                    bn: "শব্দটি বেছে নিতে হয়: ডাবল-ক্লিক করে নীল করতে হয়",
                    en: "Choose it: double-click so it turns blue",
                  },
                },
                {
                  text: { bn: "Save-এ ক্লিক করতে হয়", en: "Click Save" },
                  hint: {
                    bn: "Save চিঠিটি রেখে দেয়। আগে ডাবল-ক্লিক করে শব্দটি বেছে নিন।",
                    en: "Save keeps your letter. First, choose the word by double-clicking it.",
                  },
                },
                {
                  text: { bn: "Enter চাপতে হয়", en: "Press Enter" },
                  hint: {
                    bn: "Enter নতুন লাইন শুরু করে। আগে শব্দটি বেছে নিতে হয়।",
                    en: "Enter starts a new line. First you need to choose the word.",
                  },
                },
              ],
            },
            {
              question: {
                bn: "B বোতাম কী করে?",
                en: "What does the B button do?",
              },
              options: [
                { correct: true, text: { bn: "শব্দটি মোটা (বোল্ড) করে", en: "Makes the word bold" } },
                {
                  text: { bn: "শব্দটি বড় করে", en: "Makes the word bigger" },
                  hint: {
                    bn: "বড় করার বোতাম হলো A▲। B মানে Bold — মোটা লেখা।",
                    en: "Bigger is the A▲ button. B stands for Bold.",
                  },
                },
                {
                  text: { bn: "শব্দটি মুছে ফেলে", en: "Deletes the word" },
                  hint: {
                    bn: "B কখনো কিছু মোছে না, শুধু মোটা করে।",
                    en: "B never deletes anything. It only makes the word bold.",
                  },
                },
              ],
            },
            {
              question: {
                bn: "কখন সেভ করা উচিত?",
                en: "When should you save?",
              },
              options: [
                { correct: true, text: { bn: "কাজের মাঝে মাঝেই", en: "Often, while I work" } },
                {
                  text: { bn: "শুধু একবার, একদম শেষে", en: "Only once, when I finish" },
                  hint: {
                    bn: "মাঝে মাঝে সেভ করলে বিদ্যুৎ চলে গেলেও লেখা হারায় না।",
                    en: "Saving often keeps your work safe if the electricity goes off.",
                  },
                },
              ],
            },
          ],
        },
      },
      { id: "open-letter", minutes: 4, title: { bn: "সেভ করা চিঠি আবার খোলা", en: "Opening a saved letter" } },
      { id: "print", minutes: 4, title: { bn: "চিঠি প্রিন্ট করা", en: "Printing your letter" } },
    ],
  },
  {
    id: "excel",
    app: "excel",
    title: { bn: "মাইক্রোসফট এক্সেল", en: "Microsoft Excel" },
    description: {
      bn: "সহজ তালিকা বানানো আর হিসাব যোগ করা।",
      en: "Making simple lists and adding up numbers.",
    },
    lessons: [
      { id: "what-is-excel", minutes: 4, title: { bn: "এক্সেল কী?", en: "What is Excel?" } },
      { id: "bazar-list", minutes: 5, title: { bn: "বাজারের তালিকা বানানো", en: "Making a shopping list" } },
      { id: "add-up", minutes: 5, title: { bn: "খরচ যোগ করা", en: "Adding up what you spent" } },
    ],
  },
  {
    id: "powerpoint",
    app: "powerpoint",
    title: { bn: "মাইক্রোসফট পাওয়ারপয়েন্ট", en: "Microsoft PowerPoint" },
    description: {
      bn: "লেখা আর ছবি দিয়ে সহজ স্লাইড বানানো।",
      en: "Making simple slides with words and photos.",
    },
    lessons: [
      { id: "what-is-a-slide", minutes: 4, title: { bn: "স্লাইড কী?", en: "What is a slide?" } },
      { id: "first-slide", minutes: 5, title: { bn: "প্রথম স্লাইড বানানো", en: "Making your first slide" } },
      { id: "add-photo", minutes: 5, title: { bn: "স্লাইডে ছবি যোগ করা", en: "Adding a photo to a slide" } },
    ],
  },
];

export const getCourse = (id: string) => courses.find((c) => c.id === id);

export const getLesson = (courseId: string, lessonId: string) =>
  getCourse(courseId)?.lessons.find((l) => l.id === lessonId);

export const courseMinutes = (course: Course) =>
  course.lessons.reduce((sum, l) => sum + l.minutes, 0);

export const isReady = (lesson: Lesson) => Boolean(lesson.content);

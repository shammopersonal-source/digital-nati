// The learning path: chapters → short lessons → small exercises, one per screen.
// See README.md → "Adding a lesson".
//
// Text is written in both languages: { bn: "...", en: "..." }.
// Inside text, [[word]] marks a glossary word (messages/*.json → "glossary").
// It gets a dotted underline and explains itself when tapped.

import type { Locale } from "@/i18n/routing";

export type Text = Record<Locale, string>;

export const pick = (text: Text, locale: string) => text[locale as Locale] ?? text.bn;

/** Drawn diagrams with the important part circled. */
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

/** Small drawn objects used as answer pictures. */
export type Picture = "mouse" | "keyboard" | "screen" | "printer";

export type AppKind = "computer" | "files" | "internet" | "email" | "word" | "excel" | "powerpoint";

/** Free practice exercises (the practice room). */
export type Practice = "mouse" | "keyboard" | "shutdown" | "word";

export type MousePart = "left" | "right" | "wheel";
export type KeyName = "backspace" | "enter" | "space" | "shift";
export type Skill = "click" | "doubleClick" | "drag" | "scroll" | "backspace" | "enter";

type Base = {
  /** Recorded voice for this screen, e.g. { bn: "/audio/mouse-1.mp3" }. Without it, the computer's voice is used. */
  audio?: Partial<Record<Locale, string>>;
};

export type Exercise = Base &
  (
    | {
        /** A teaching card: something new, explained with a picture. No question. */
        kind: "learn";
        text: Text;
        figure?: Figure;
        picture?: Picture;
      }
    | {
        /** Pick one answer (words or pictures). */
        kind: "choice";
        prompt: Text;
        options: { text?: Text; picture?: Picture; correct?: boolean; hint?: Text }[];
        explain?: Text;
      }
    | {
        /** Tap the right part of a mouse or keyboard picture. */
        kind: "tap";
        prompt: Text;
        on: "mouse" | "keyboard";
        answer: MousePart | KeyName;
        explain?: Text;
      }
    | {
        /** Match the pairs: tap one on the left, then its partner on the right. */
        kind: "match";
        prompt: Text;
        pairs: { left: Text; right: Text }[];
      }
    | {
        /** Put the steps in order (written here in the right order; shown shuffled). */
        kind: "order";
        prompt: Text;
        steps: Text[];
        explain?: Text;
      }
    | {
        /** Type something. Without `answer`, any 2 or more letters is right. */
        kind: "type";
        prompt: Text;
        answer?: Text;
        caseSensitive?: boolean;
        explain?: Text;
      }
    | {
        /** Do it for real on a practice area: click, double-click, drag, scroll, Backspace, Enter. */
        kind: "do";
        prompt: Text;
        skill: Skill;
      }
  );

export type Lesson = {
  id: string;
  title: Text;
  minutes: number;
  /** Lessons without exercises are shown as "coming soon". */
  exercises?: Exercise[];
};

export type Chapter = {
  id: string;
  title: Text;
  description: Text;
  app: AppKind;
  /** A short optional video to watch before the chapter, e.g. "/videos/mouse.mp4". */
  video?: string;
  lessons: Lesson[];
};

const L = (bn: string, en: string): Text => ({ bn, en });

export const chapters: Chapter[] = [
  {
    id: "mouse",
    app: "computer",
    title: L("মাউস", "The mouse"),
    description: L("ক্লিক, ডাবল ক্লিক, টেনে আনা, পাতা সরানো।", "Click, double-click, drag, scroll."),
    lessons: [
      {
        id: "meet",
        minutes: 3,
        title: L("মাউস চিনুন", "Meet the mouse"),
        exercises: [
          { kind: "learn", figure: "mouse-hand", text: L("এটাই মাউস। হাতটা হালকা করে এর উপর রাখুন।", "This is the mouse. Rest your hand on it lightly.") },
          {
            kind: "choice",
            prompt: L("কোনটা মাউস?", "Which is the mouse?"),
            options: [{ picture: "keyboard" }, { picture: "mouse", correct: true }, { picture: "screen" }],
            explain: L("ছোট আর গোলগাল, হাতের তালুর মাপের।", "Small and rounded, the size of your palm."),
          },
          { kind: "learn", figure: "mouse-left", text: L("বাম বাটনটাই সবচেয়ে বেশি লাগে।", "You'll use the left button the most.") },
          {
            kind: "tap",
            on: "mouse",
            answer: "left",
            prompt: L("বাম বাটনটা ছুঁয়ে দিন।", "Touch the left button."),
            explain: L("বাম দিকের উপরের অংশটা।", "The top left part."),
          },
          { kind: "learn", figure: "mouse-wheel", text: L("মাঝের ছোট চাকা দিয়ে পাতা উপর-নিচ করা যায়।", "The small wheel moves the page up and down.") },
          {
            kind: "tap",
            on: "mouse",
            answer: "wheel",
            prompt: L("এবার চাকাটা ছুঁয়ে দিন।", "Now touch the wheel."),
            explain: L("দুই বাটনের ঠিক মাঝখানে।", "Right between the two buttons."),
          },
          {
            kind: "learn",
            text: L("মাউস নাড়ালে স্ক্রিনের তীরচিহ্নটাও নড়ে। এর নাম [[cursor]]।", "Move the mouse and the arrow on the screen moves too. It's the [[cursor]]."),
          },
          { kind: "do", skill: "click", prompt: L("তীরচিহ্ন সবুজ গোলের উপর নিয়ে ক্লিক করুন।", "Put the arrow on the green circle and click.") },
          {
            kind: "choice",
            prompt: L("মাউস টেবিলের কিনারায় চলে গেছে। এখন?", "The mouse is at the table's edge. Now?"),
            options: [
              { correct: true, text: L("তুলে মাঝখানে রাখব", "Lift it back to the middle") },
              {
                text: L("আর নাড়ানো যাবে না", "It can't move any more"),
                hint: L("মাউস তুলে নিলেও তীরচিহ্ন জায়গাতেই থাকে।", "Lift it — the arrow stays put."),
              },
            ],
          },
        ],
      },
      {
        id: "click",
        minutes: 4,
        title: L("ক্লিক আর ডাবল ক্লিক", "Click and double-click"),
        exercises: [
          { kind: "learn", figure: "mouse-left", text: L("[[click]] মানে বাম বাটনে একবার চাপ।", "To [[click]] is to press the left button once.") },
          { kind: "do", skill: "click", prompt: L("সবুজ গোলগুলোতে একে একে ক্লিক করুন।", "Click the green circles, one by one.") },
          { kind: "learn", text: L("[[doubleClick]] মানে তাড়াতাড়ি দুইবার চাপ। এতে ফোল্ডার খোলে।", "To [[doubleClick]] is two quick presses. It opens folders.") },
          { kind: "do", skill: "doubleClick", prompt: L("ফোল্ডারে ডাবল ক্লিক করে খুলুন।", "Double-click the folder to open it.") },
          {
            kind: "match",
            prompt: L("জোড়া মেলান", "Match the pairs"),
            pairs: [
              { left: L("ক্লিক", "Click"), right: L("একবার চাপ", "Press once") },
              { left: L("ডাবল ক্লিক", "Double-click"), right: L("দুইবার চাপ", "Press twice") },
              { left: L("চাকা", "Wheel"), right: L("পাতা উপর-নিচ", "Page up and down") },
            ],
          },
          {
            kind: "choice",
            prompt: L("ফোল্ডার খুলবেন কীভাবে?", "How do you open a folder?"),
            options: [
              { text: L("একবার ক্লিক", "Click once"), hint: L("একবার চাপলে শুধু বাছাই হয়।", "One click only selects it.") },
              { correct: true, text: L("ডাবল ক্লিক", "Double-click") },
              { text: L("চাকা ঘুরিয়ে", "Turn the wheel"), hint: L("চাকা শুধু পাতা সরায়।", "The wheel only moves the page.") },
            ],
          },
          { kind: "do", skill: "doubleClick", prompt: L("আরেকবার: ফোল্ডারটা খুলুন।", "Once more: open the folder.") },
        ],
      },
      {
        id: "drag",
        minutes: 4,
        title: L("টেনে আনা (ড্র্যাগ)", "Dragging"),
        exercises: [
          { kind: "learn", text: L("[[drag]] মানে চেপে ধরে টেনে নেওয়া — যেমন আম তুলে ঝুড়িতে রাখা।", "To [[drag]] is to hold and move — like putting a mango in a basket.") },
          {
            kind: "order",
            prompt: L("ঠিক ক্রমে সাজান", "Put them in order"),
            steps: [
              L("বাম বাটন চেপে ধরুন", "Hold the left button"),
              L("ধরে রেখেই মাউস সরান", "Keep holding, move the mouse"),
              L("জায়গামতো গিয়ে ছেড়ে দিন", "Let go at the right spot"),
            ],
          },
          { kind: "do", skill: "drag", prompt: L("আমটা টেনে ঝুড়িতে রাখুন।", "Drag the mango into the basket.") },
          {
            kind: "choice",
            prompt: L("বাটন কখন ছাড়বেন?", "When do you let go?"),
            options: [
              { correct: true, text: L("জায়গামতো পৌঁছে", "When it's in place") },
              { text: L("শুরুতেই", "Straight away"), hint: L("আগে ছাড়লে জিনিসটা সাথে আসবে না।", "Let go early and it stays behind.") },
            ],
          },
          { kind: "do", skill: "drag", prompt: L("আরেকবার করুন।", "Once more.") },
        ],
      },
      {
        id: "scroll",
        minutes: 3,
        title: L("পাতা উপর-নিচ (স্ক্রল)", "Scrolling"),
        exercises: [
          {
            kind: "learn",
            figure: "mouse-wheel",
            text: L("পাতার নিচে যেতে চাকাটা নিজের দিকে ঘোরান। একে বলে [[scroll]]।", "To go down a page, roll the wheel towards you. That's called [[scroll]]."),
          },
          {
            kind: "tap",
            on: "mouse",
            answer: "wheel",
            prompt: L("স্ক্রল হয় কোনটা দিয়ে? ছুঁয়ে দিন।", "What do you scroll with? Touch it."),
            explain: L("মাঝের চাকাটা দিয়ে।", "With the wheel in the middle."),
          },
          { kind: "do", skill: "scroll", prompt: L("স্ক্রল করে লুকানো ফুলটা খুঁজুন।", "Scroll to find the hidden flower.") },
          {
            kind: "choice",
            prompt: L("চাকা নিজের দিকে ঘোরালে কী হয়?", "Roll the wheel towards you. What happens?"),
            options: [
              { correct: true, text: L("পাতার নিচের অংশ দেখা যায়", "You see further down the page") },
              { text: L("কম্পিউটার বন্ধ হয়", "The computer turns off"), hint: L("না, চাকা শুধু পাতা সরায়।", "No — the wheel only moves the page.") },
            ],
          },
          {
            kind: "match",
            prompt: L("যা শিখলেন, মিলিয়ে নিন", "Match what you've learned"),
            pairs: [
              { left: L("ক্লিক", "Click"), right: L("একবার চাপ", "Press once") },
              { left: L("ডাবল ক্লিক", "Double-click"), right: L("দুইবার চাপ", "Press twice") },
              { left: L("ড্র্যাগ", "Drag"), right: L("চেপে ধরে টানা", "Hold and move") },
              { left: L("স্ক্রল", "Scroll"), right: L("পাতা উপর-নিচ", "Page up and down") },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "keyboard",
    app: "computer",
    title: L("কি-বোর্ড", "The keyboard"),
    description: L("টাইপ করা, মোছা, স্পেস আর বড় হাতের অক্ষর।", "Typing, rubbing out, spaces and capitals."),
    lessons: [
      {
        id: "meet",
        minutes: 4,
        title: L("কি-বোর্ড চিনুন", "Meet the keyboard"),
        exercises: [
          { kind: "learn", picture: "keyboard", text: L("এটাই কি-বোর্ড। এর বাটন চেপে লেখা হয়।", "This is the keyboard. You type by pressing its keys.") },
          {
            kind: "choice",
            prompt: L("কোনটা কি-বোর্ড?", "Which is the keyboard?"),
            options: [{ picture: "mouse" }, { picture: "screen" }, { picture: "keyboard", correct: true }],
          },
          { kind: "learn", figure: "keyboard-enter", text: L("ডানের বড় বাটনটা [[enter]]। মানে “ঠিক আছে”, বা নতুন লাইন।", "The big key on the right is [[enter]]: “OK”, or a new line.") },
          {
            kind: "tap",
            on: "keyboard",
            answer: "enter",
            prompt: L("Enter বাটনটা ছুঁয়ে দিন।", "Touch the Enter key."),
            explain: L("ডান দিকে, অক্ষরগুলোর পাশে।", "On the right, next to the letters."),
          },
          { kind: "learn", figure: "keyboard-backspace", text: L("উপরের ডান কোণে [[backspace]]। এটা আগের অক্ষর মুছে দেয়।", "Top right is [[backspace]]. It rubs out the last letter.") },
          {
            kind: "tap",
            on: "keyboard",
            answer: "backspace",
            prompt: L("Backspace বাটনটা ছুঁয়ে দিন।", "Touch the Backspace key."),
            explain: L("উপরের সারির একদম ডানে, ← চিহ্ন।", "Far right of the top row, with a ←."),
          },
          { kind: "learn", figure: "keyboard-space", text: L("নিচের লম্বা বাটনটা স্পেসবার। এটা দুই শব্দের মাঝে ফাঁকা দেয়।", "The long key at the bottom is the space bar. It puts a gap between words.") },
          {
            kind: "tap",
            on: "keyboard",
            answer: "space",
            prompt: L("স্পেসবারটা ছুঁয়ে দিন।", "Touch the space bar."),
            explain: L("সবচেয়ে লম্বা বাটনটা।", "The longest key."),
          },
          {
            kind: "match",
            prompt: L("জোড়া মেলান", "Match the pairs"),
            pairs: [
              { left: L("Enter", "Enter"), right: L("ঠিক আছে / নতুন লাইন", "OK / new line") },
              { left: L("Backspace", "Backspace"), right: L("অক্ষর মোছা", "Rub out a letter") },
              { left: L("স্পেসবার", "Space bar"), right: L("ফাঁকা জায়গা", "A gap") },
            ],
          },
        ],
      },
      {
        id: "typing",
        minutes: 5,
        title: L("টাইপ করা আর মোছা", "Typing and rubbing out"),
        exercises: [
          { kind: "learn", text: L("টাইপের আগে যেখানে লিখবেন, সেখানে একবার [[click]] করুন।", "Before typing, [[click]] where you want to write.") },
          { kind: "type", prompt: L("ঘরে আপনার নাম টাইপ করুন (ইংরেজিতে)।", "Type your name in the box.") },
          { kind: "do", skill: "backspace", prompt: L("Backspace একবার চাপুন।", "Press Backspace once.") },
          {
            kind: "type",
            prompt: L("টাইপ করুন: ami", "Type: tea"),
            answer: L("ami", "tea"),
            explain: L("হলুদ বাটনটা একে একে চাপুন।", "Press the yellow key each time."),
          },
          { kind: "do", skill: "enter", prompt: L("এবার Enter চাপুন।", "Now press Enter.") },
          {
            kind: "choice",
            prompt: L("ভুল অক্ষর মুছবেন কোন বাটনে?", "Which key rubs out a mistake?"),
            options: [
              { correct: true, text: L("Backspace", "Backspace") },
              { text: L("Enter", "Enter"), hint: L("Enter নতুন লাইন দেয়।", "Enter makes a new line.") },
              { text: L("স্পেসবার", "Space bar"), hint: L("স্পেসবার শুধু ফাঁকা দেয়।", "The space bar only adds a gap.") },
            ],
          },
          {
            kind: "order",
            prompt: L("ঠিক ক্রমে সাজান", "Put them in order"),
            steps: [
              L("যেখানে লিখবেন, ক্লিক করুন", "Click where you'll write"),
              L("অক্ষরগুলো চাপুন", "Press the letters"),
              L("শেষে Enter চাপুন", "Press Enter at the end"),
            ],
          },
        ],
      },
      {
        id: "space-shift",
        minutes: 5,
        title: L("স্পেস আর বড় হাতের অক্ষর", "Spaces and capitals"),
        exercises: [
          { kind: "learn", figure: "keyboard-space", text: L("দুই শব্দের মাঝে একবার স্পেসবার চাপুন।", "Press the space bar once between words.") },
          {
            kind: "type",
            prompt: L("টাইপ করুন: ami bhalo", "Type: good morning"),
            answer: L("ami bhalo", "good morning"),
            explain: L("মাঝে একবার স্পেস দিন।", "One space in the middle."),
          },
          { kind: "learn", figure: "keyboard-shift", text: L("বড় হাতের অক্ষর লিখতে Shift চেপে ধরে অক্ষরটা চাপুন।", "For a capital letter, hold Shift and press the letter.") },
          {
            kind: "tap",
            on: "keyboard",
            answer: "shift",
            prompt: L("Shift বাটনটা ছুঁয়ে দিন।", "Touch the Shift key."),
            explain: L("বাম দিকে, নিচ থেকে দ্বিতীয় সারিতে।", "On the left, second row from the bottom."),
          },
          {
            kind: "type",
            prompt: L("টাইপ করুন: Dhaka", "Type: Dhaka"),
            answer: L("Dhaka", "Dhaka"),
            caseSensitive: true,
            explain: L("Shift ধরে D, তারপর বাকিটা।", "Hold Shift, press D, then the rest."),
          },
          {
            kind: "choice",
            prompt: L("Shift দিয়ে কী হয়?", "What does Shift do?"),
            options: [
              { correct: true, text: L("বড় হাতের অক্ষর", "Capital letters") },
              { text: L("অক্ষর মোছা", "Rubs out letters"), hint: L("মোছে Backspace।", "Backspace rubs out.") },
              { text: L("নতুন লাইন", "A new line"), hint: L("নতুন লাইন দেয় Enter।", "Enter makes a new line.") },
            ],
          },
          {
            kind: "type",
            prompt: L("শেষটা — টাইপ করুন: Bangladesh", "Last one — type: Bangladesh"),
            answer: L("Bangladesh", "Bangladesh"),
            caseSensitive: true,
            explain: L("প্রথম B বড় হাতের।", "The first B is a capital."),
          },
        ],
      },
    ],
  },
  {
    id: "windows",
    app: "computer",
    title: L("উইন্ডোজ", "Windows"),
    description: L("ডেস্কটপ, উইন্ডো আর ঠিকভাবে বন্ধ করা।", "Desktop, windows, turning off."),
    lessons: [
      { id: "desktop", minutes: 4, title: L("ডেস্কটপ আর আইকন", "Desktop and icons") },
      { id: "windows", minutes: 5, title: L("উইন্ডো খোলা ও বন্ধ", "Opening and closing windows") },
      { id: "turn-off", minutes: 4, title: L("কম্পিউটার বন্ধের নিয়ম", "Turning the computer off") },
    ],
  },
  {
    id: "files",
    app: "files",
    title: L("ফাইল ও ফোল্ডার", "Files and folders"),
    description: L("কাজ রেখে দেওয়া আর খুঁজে পাওয়া।", "Keeping and finding your work."),
    lessons: [
      { id: "what-is-a-file", minutes: 4, title: L("ফাইল কী?", "What is a file?") },
      { id: "make-a-folder", minutes: 5, title: L("নতুন ফোল্ডার", "A new folder") },
      { id: "find-a-file", minutes: 5, title: L("হারানো ফাইল খোঁজা", "Finding a lost file") },
    ],
  },
  {
    id: "internet-safety",
    app: "internet",
    title: L("নিরাপদ ইন্টারনেট", "The internet, safely"),
    description: L("গুগলে খোঁজা, আর প্রতারণা চেনা।", "Searching, and spotting scams."),
    lessons: [
      { id: "browser", minutes: 4, title: L("ব্রাউজার কী?", "What is a browser?") },
      { id: "search", minutes: 5, title: L("গুগলে খোঁজা", "Searching on Google") },
      { id: "fake-prizes", minutes: 5, title: L("ভুয়া পুরস্কারের মেসেজ", "Fake prize messages") },
      { id: "fake-calls", minutes: 5, title: L("বিকাশ-নগদের ভুয়া কল", "Fake bKash and Nagad calls") },
    ],
  },
  {
    id: "whatsapp-email",
    app: "email",
    title: L("হোয়াটসঅ্যাপ ও ইমেইল", "WhatsApp and email"),
    description: L("ভিডিও কল, ছবি পাঠানো আর ইমেইল।", "Video calls, photos and email."),
    lessons: [
      { id: "video-call", minutes: 5, title: L("হোয়াটসঅ্যাপে ভিডিও কল", "A WhatsApp video call") },
      { id: "photo", minutes: 5, title: L("ছবি পাঠানো", "Sending a photo") },
      { id: "read-email", minutes: 5, title: L("ইমেইল পড়া", "Reading email") },
      { id: "write-email", minutes: 5, title: L("ইমেইল পাঠানো", "Sending email") },
    ],
  },
  {
    id: "word",
    app: "word",
    title: L("মাইক্রোসফট ওয়ার্ড", "Microsoft Word"),
    description: L("চিঠি আর দরখাস্ত লেখা।", "Writing letters and applications."),
    lessons: [
      { id: "first-letter", minutes: 6, title: L("প্রথম চিঠি লেখা", "Your first letter") },
      { id: "open-letter", minutes: 4, title: L("চিঠি আবার খোলা", "Opening it again") },
      { id: "print", minutes: 4, title: L("চিঠি প্রিন্ট করা", "Printing it") },
    ],
  },
  {
    id: "excel",
    app: "excel",
    title: L("মাইক্রোসফট এক্সেল", "Microsoft Excel"),
    description: L("বাজারের হিসাব রাখা।", "Keeping simple accounts."),
    lessons: [
      { id: "what-is-excel", minutes: 4, title: L("এক্সেল কী?", "What is Excel?") },
      { id: "bazar-list", minutes: 5, title: L("বাজারের লিস্ট", "A shopping list") },
      { id: "add-up", minutes: 5, title: L("খরচের যোগফল", "Adding up costs") },
    ],
  },
  {
    id: "powerpoint",
    app: "powerpoint",
    title: L("মাইক্রোসফট পাওয়ারপয়েন্ট", "Microsoft PowerPoint"),
    description: L("ছবি দিয়ে স্লাইড বানানো।", "Making slides with photos."),
    lessons: [
      { id: "what-is-a-slide", minutes: 4, title: L("স্লাইড কী?", "What is a slide?") },
      { id: "first-slide", minutes: 5, title: L("প্রথম স্লাইড", "Your first slide") },
      { id: "add-photo", minutes: 5, title: L("স্লাইডে ছবি", "Adding a photo") },
    ],
  },
];

export const getChapter = (id: string) => chapters.find((c) => c.id === id);

export const getLesson = (chapterId: string, lessonId: string) =>
  getChapter(chapterId)?.lessons.find((l) => l.id === lessonId);

export const isReady = (lesson: Lesson) => Boolean(lesson.exercises?.length);

/** A stable id for one exercise, used to remember mistakes. */
export const exerciseKey = (chapterId: string, lessonId: string, index: number) => `${chapterId}/${lessonId}/${index}`;

export function exerciseByKey(key: string) {
  const [chapterId, lessonId, index] = key.split("/");
  return getLesson(chapterId, lessonId)?.exercises?.[Number(index)];
}

/** Every lesson in path order, with its chapter. */
export const allLessons = chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ chapter, lesson })));

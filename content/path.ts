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
    description: L("মাউস ধরা, ক্লিক, ডাবল-ক্লিক, ড্র্যাগ আর স্ক্রল।", "Holding the mouse, clicking, double-clicking, dragging and scrolling."),
    lessons: [
      {
        id: "meet",
        minutes: 3,
        title: L("মাউস চিনুন", "Meet the mouse"),
        exercises: [
          {
            kind: "learn",
            figure: "mouse-hand",
            text: L(
              "এটা মাউস। এর ওপর হাতটি আলতো করে রাখুন — তর্জনী থাকবে বাঁ বোতামে, মধ্যমা থাকবে ডান বোতামে।",
              "This is the mouse. Rest your hand on it gently — your first finger on the left button, your middle finger on the right button.",
            ),
          },
          {
            kind: "choice",
            prompt: L("কোনটা মাউস?", "Which one is the mouse?"),
            options: [{ picture: "keyboard" }, { picture: "mouse", correct: true }, { picture: "screen" }],
            explain: L("মাউস ছোট আর গোলগাল, হাতের তালুর মাপের।", "The mouse is small and rounded, about the size of your palm."),
          },
          {
            kind: "learn",
            figure: "mouse-left",
            text: L("বাঁ দিকের বোতামটিই সবচেয়ে বেশি লাগে।", "The left button is the one you will use most."),
          },
          {
            kind: "tap",
            on: "mouse",
            answer: "left",
            prompt: L("ছবিতে মাউসের বাঁ বোতামটি ছুঁয়ে দিন।", "Touch the left button on the picture of the mouse."),
            explain: L("বাঁ বোতাম হলো ওপরের বাঁ দিকের অংশটা।", "The left button is the top left part."),
          },
          {
            kind: "learn",
            figure: "mouse-wheel",
            text: L(
              "দুই বোতামের মাঝে একটি ছোট চাকা আছে। এটা দিয়ে পাতা ওপরে-নিচে সরানো যায়।",
              "Between the two buttons there is a small wheel. It moves the page up and down.",
            ),
          },
          {
            kind: "tap",
            on: "mouse",
            answer: "wheel",
            prompt: L("এবার চাকাটি ছুঁয়ে দিন।", "Now touch the wheel."),
            explain: L("চাকাটি দুই বোতামের ঠিক মাঝখানে।", "The wheel is right in the middle, between the two buttons."),
          },
          {
            kind: "learn",
            text: L(
              "মাউস টেবিলে সরালে স্ক্রিনের ছোট তীরচিহ্ন — [[cursor]] — একই দিকে সরে।",
              "When you move the mouse on the table, the small arrow on the screen — the [[cursor]] — moves the same way.",
            ),
          },
          {
            kind: "do",
            skill: "click",
            prompt: L(
              "তীরচিহ্নটি সবুজ বৃত্তের ওপর নিয়ে যান, তারপর বাঁ বোতাম একবার চাপুন।",
              "Move the arrow onto the green circle, then press the left button once.",
            ),
          },
          {
            kind: "choice",
            prompt: L("মাউস টেবিলের কিনারায় চলে গেছে। কী করবেন?", "The mouse has reached the edge of the table. What do you do?"),
            options: [
              { correct: true, text: L("মাউস তুলে আবার মাঝখানে রাখব", "Lift it up and put it back in the middle") },
              {
                text: L("থেমে যাব — আর সরানো যাবে না", "Stop — it can't go any further"),
                hint: L("মাউস তুলে নেওয়া যায়। তীরচিহ্ন যেখানে আছে সেখানেই থাকে।", "You can lift the mouse. The arrow stays where it is."),
              },
            ],
            explain: L("মাউস তুলে নিলে তীরচিহ্ন যেখানে আছে সেখানেই থাকে।", "When you lift the mouse, the arrow stays where it is."),
          },
        ],
      },
      {
        id: "click",
        minutes: 4,
        title: L("ক্লিক আর ডাবল-ক্লিক", "Click and double-click"),
        exercises: [
          {
            kind: "learn",
            figure: "mouse-left",
            text: L(
              "[[click]] মানে বাঁ বোতাম একবার চেপে ছেড়ে দেওয়া। কিছু বেছে নিতে এটা লাগে।",
              "To [[click]] means to press the left button once and let go. You use it to choose something.",
            ),
          },
          {
            kind: "do",
            skill: "click",
            prompt: L("সবুজ বৃত্তগুলোতে একটি একটি করে ক্লিক করুন।", "Click on the green circles, one at a time."),
          },
          {
            kind: "learn",
            text: L(
              "[[doubleClick]] মানে বাঁ বোতাম পরপর দুইবার, একটু তাড়াতাড়ি চাপা। ফোল্ডার বা ছবি খুলতে এটা লাগে।",
              "To [[doubleClick]] means to press the left button twice, a little quickly. You use it to open a folder or a photo.",
            ),
          },
          {
            kind: "do",
            skill: "doubleClick",
            prompt: L("ফোল্ডারটির ওপর ডাবল-ক্লিক করে খুলুন।", "Double-click on the folder to open it."),
          },
          {
            kind: "match",
            prompt: L("জোড়া মেলান", "Match the pairs"),
            pairs: [
              { left: L("Click", "Click"), right: L("একবার চাপা", "Press once") },
              { left: L("Double-click", "Double-click"), right: L("তাড়াতাড়ি দুইবার চাপা", "Press twice, quickly") },
              { left: L("চাকা (Wheel)", "Wheel"), right: L("পাতা ওপরে-নিচে সরানো", "Move the page up and down") },
            ],
          },
          {
            kind: "choice",
            prompt: L("একটি ফোল্ডার খুলতে কী করবেন?", "How do you open a folder?"),
            options: [
              {
                text: L("একবার ক্লিক করব", "Click once"),
                hint: L("একবার ক্লিক করলে শুধু বেছে নেওয়া হয়, খোলে না।", "One click only chooses it; it doesn't open it."),
              },
              { correct: true, text: L("ডাবল-ক্লিক করব", "Double-click") },
              {
                text: L("চাকা ঘোরাব", "Turn the wheel"),
                hint: L("চাকা ঘোরালে পাতা সরে, কিছু খোলে না।", "Turning the wheel moves the page; it doesn't open anything."),
              },
            ],
            explain: L("খুলতে হলে ডাবল-ক্লিক — তাড়াতাড়ি দুইবার।", "To open something: double-click — two quick clicks."),
          },
          {
            kind: "do",
            skill: "doubleClick",
            prompt: L("আরেকবার: ফোল্ডারটি ডাবল-ক্লিক করে খুলুন।", "Once more: double-click to open the folder."),
          },
        ],
      },
      {
        id: "drag",
        minutes: 4,
        title: L("ধরে টেনে নেওয়া (ড্র্যাগ)", "Dragging"),
        exercises: [
          {
            kind: "learn",
            text: L(
              "[[drag]] মানে কোনো কিছু ধরে অন্য জায়গায় নিয়ে যাওয়া — যেমন হাতে আম তুলে ঝুড়িতে রাখা।",
              "To [[drag]] means to pick something up and move it — like picking up a mango and putting it in a basket.",
            ),
          },
          {
            kind: "order",
            prompt: L("ড্র্যাগ করার ধাপগুলো ঠিক ক্রমে সাজান।", "Put the steps for dragging in the right order."),
            steps: [
              L("জিনিসটির ওপর বাঁ বোতাম চেপে ধরুন", "Press and hold the left button on the thing"),
              L("চেপে রেখেই মাউস সরান", "Keep holding and move the mouse"),
              L("জায়গামতো পৌঁছে বোতাম ছেড়ে দিন", "When you get there, let go of the button"),
            ],
          },
          {
            kind: "do",
            skill: "drag",
            prompt: L("আমটি ধরে ঝুড়িতে নিয়ে যান।", "Drag the mango into the basket."),
          },
          {
            kind: "choice",
            prompt: L("ড্র্যাগ করার সময় বোতাম কখন ছাড়বেন?", "When dragging, when do you let go of the button?"),
            options: [
              { correct: true, text: L("জায়গামতো পৌঁছানোর পর", "When it has reached the right place") },
              {
                text: L("শুরুতেই", "Straight away"),
                hint: L("শুরুতে ছেড়ে দিলে জিনিসটি সঙ্গে আসবে না।", "If you let go at the start, the thing won't come with you."),
              },
            ],
          },
          {
            kind: "do",
            skill: "drag",
            prompt: L("আরেকবার: আমটি ঝুড়িতে রাখুন।", "Once more: put the mango in the basket."),
          },
        ],
      },
      {
        id: "scroll",
        minutes: 3,
        title: L("পাতা সরানো (স্ক্রল)", "Scrolling"),
        exercises: [
          {
            kind: "learn",
            figure: "mouse-wheel",
            text: L(
              "লম্বা পাতার নিচের অংশ দেখতে [[scroll]] করুন: চাকাটি নিজের দিকে ঘোরালে নিচের লেখা উঠে আসে।",
              "To see the lower part of a long page, [[scroll]]: turn the wheel towards you and the writing further down comes up.",
            ),
          },
          {
            kind: "tap",
            on: "mouse",
            answer: "wheel",
            prompt: L("স্ক্রল করতে মাউসের কোন অংশ লাগে? ছুঁয়ে দিন।", "Which part of the mouse do you use to scroll? Touch it."),
            explain: L("স্ক্রল করতে মাঝের চাকাটি লাগে।", "You scroll with the wheel in the middle."),
          },
          {
            kind: "do",
            skill: "scroll",
            prompt: L("বাক্সের ভেতরে স্ক্রল করে লুকানো ফুলটি খুঁজুন।", "Scroll inside the box to find the hidden flower."),
          },
          {
            kind: "choice",
            prompt: L("চাকা নিজের দিকে ঘোরালে কী হয়?", "What happens when you turn the wheel towards you?"),
            options: [
              { correct: true, text: L("পাতার নিচের অংশ দেখা যায়", "You see the lower part of the page") },
              {
                text: L("কম্পিউটার বন্ধ হয়ে যায়", "The computer turns off"),
                hint: L("চাকা ঘোরালে কিছুই বন্ধ হয় না, শুধু পাতা সরে।", "Turning the wheel never turns anything off; it only moves the page."),
              },
            ],
          },
          {
            kind: "match",
            prompt: L("যা শিখলেন, জোড়া মেলান", "Match what you have learned"),
            pairs: [
              { left: L("Click", "Click"), right: L("একবার চাপা", "Press once") },
              { left: L("Double-click", "Double-click"), right: L("তাড়াতাড়ি দুইবার চাপা", "Press twice, quickly") },
              { left: L("Drag", "Drag"), right: L("ধরে টেনে নেওয়া", "Pick up and move") },
              { left: L("Scroll", "Scroll"), right: L("পাতা সরানো", "Move the page") },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "keyboard",
    app: "computer",
    title: L("কিবোর্ড", "The keyboard"),
    description: L("কিবোর্ড চেনা, লেখা, মোছা, ফাঁকা জায়গা আর বড় হাতের অক্ষর।", "Getting to know the keyboard: typing, rubbing out, spaces and capital letters."),
    lessons: [
      {
        id: "meet",
        minutes: 4,
        title: L("কিবোর্ড চিনুন", "Meet the keyboard"),
        exercises: [
          {
            kind: "learn",
            picture: "keyboard",
            text: L(
              "এটা কিবোর্ড। এর প্রতিটি বোতামে একটি অক্ষর, একটি সংখ্যা, বা একটি কাজের নাম লেখা আছে।",
              "This is the keyboard. Each of its keys has a letter, a number or the name of a job written on it.",
            ),
          },
          {
            kind: "choice",
            prompt: L("কোনটা কিবোর্ড?", "Which one is the keyboard?"),
            options: [{ picture: "mouse" }, { picture: "screen" }, { picture: "keyboard", correct: true }],
          },
          {
            kind: "learn",
            figure: "keyboard-enter",
            text: L(
              "ডান দিকের বড় বোতামটি [[enter]]। এর মানে “হ্যাঁ, এগিয়ে যাও”, বা নতুন লাইন।",
              "The big key on the right is [[enter]]. It means “yes, go ahead”, or a new line.",
            ),
          },
          {
            kind: "tap",
            on: "keyboard",
            answer: "enter",
            prompt: L("ছবিতে Enter বোতামটি ছুঁয়ে দিন।", "Touch the Enter key on the picture."),
            explain: L("Enter ডান দিকে, অক্ষরগুলোর পাশে।", "Enter is on the right, next to the letters."),
          },
          {
            kind: "learn",
            figure: "keyboard-backspace",
            text: L(
              "ওপরে ডান দিকের বোতামটি [[backspace]]। এটা ঠিক আগের অক্ষরটি মুছে দেয়।",
              "The key at the top right is [[backspace]]. It rubs out the letter just before.",
            ),
          },
          {
            kind: "tap",
            on: "keyboard",
            answer: "backspace",
            prompt: L("এবার Backspace বোতামটি ছুঁয়ে দিন।", "Now touch the Backspace key."),
            explain: L("Backspace ওপরের সারির একদম ডানে, ← চিহ্ন দেওয়া।", "Backspace is at the far right of the top row, with a ← on it."),
          },
          {
            kind: "learn",
            figure: "keyboard-space",
            text: L(
              "সবচেয়ে নিচের লম্বা বোতামটি Space। এটা দুই শব্দের মাঝে ফাঁকা দেয়।",
              "The long key at the very bottom is Space. It puts a gap between two words.",
            ),
          },
          {
            kind: "tap",
            on: "keyboard",
            answer: "space",
            prompt: L("Space বোতামটি ছুঁয়ে দিন।", "Touch the Space bar."),
            explain: L("Space সবচেয়ে নিচের সবচেয়ে লম্বা বোতাম।", "Space is the longest key, at the bottom."),
          },
          {
            kind: "match",
            prompt: L("জোড়া মেলান", "Match the pairs"),
            pairs: [
              { left: L("Enter", "Enter"), right: L("এগিয়ে যাও / নতুন লাইন", "Go ahead / new line") },
              { left: L("Backspace", "Backspace"), right: L("আগের অক্ষর মোছা", "Rub out the letter before") },
              { left: L("Space", "Space"), right: L("শব্দের মাঝে ফাঁকা", "A gap between words") },
            ],
          },
        ],
      },
      {
        id: "typing",
        minutes: 5,
        title: L("লেখা আর মোছা", "Typing and rubbing out"),
        exercises: [
          {
            kind: "learn",
            text: L(
              "লেখার আগে যেখানে লিখবেন সেখানে [[click]] করুন। সেখানে একটি সরু দাগ জ্বলবে-নিভবে — অক্ষর ওখানেই বসবে।",
              "Before you type, [[click]] where you want to write. A thin line will blink there — that is where the letters go.",
            ),
          },
          {
            kind: "type",
            prompt: L("বাক্সে ক্লিক করে আপনার নাম লিখুন (ইংরেজি অক্ষরে)।", "Click in the box and type your name."),
          },
          {
            kind: "do",
            skill: "backspace",
            prompt: L("Backspace একবার চাপুন — শেষ অক্ষরটি মুছে যাবে।", "Press Backspace once — the last letter will be rubbed out."),
          },
          {
            kind: "type",
            prompt: L("এই শব্দটি লিখুন: ami", "Type this word: tea"),
            answer: L("ami", "tea"),
            explain: L("নিচের ছবির কিবোর্ডে যে বোতামটি জ্বলছে, সেটাই এরপর চাপতে হবে।", "The key that glows on the keyboard picture is the one to press next."),
          },
          {
            kind: "do",
            skill: "enter",
            prompt: L("লেখা শেষ। এবার Enter চাপুন।", "You've finished writing. Now press Enter."),
          },
          {
            kind: "choice",
            prompt: L("ভুল অক্ষর মুছতে কোন বোতাম চাপবেন?", "Which key rubs out a wrong letter?"),
            options: [
              { correct: true, text: L("Backspace", "Backspace") },
              {
                text: L("Enter", "Enter"),
                hint: L("Enter নতুন লাইন শুরু করে, কিছু মোছে না।", "Enter starts a new line; it doesn't rub anything out."),
              },
              {
                text: L("Space", "Space"),
                hint: L("Space ফাঁকা জায়গা দেয়, কিছু মোছে না।", "Space adds a gap; it doesn't rub anything out."),
              },
            ],
          },
          {
            kind: "order",
            prompt: L("লেখার ধাপগুলো সাজান।", "Put the steps for typing in order."),
            steps: [
              L("যেখানে লিখবেন সেখানে ক্লিক করুন", "Click where you want to write"),
              L("অক্ষরগুলো একটি একটি করে চাপুন", "Press the letters one at a time"),
              L("শেষে Enter চাপুন", "Press Enter at the end"),
            ],
          },
        ],
      },
      {
        id: "space-shift",
        minutes: 5,
        title: L("ফাঁকা জায়গা আর বড় হাতের অক্ষর", "Spaces and capital letters"),
        exercises: [
          {
            kind: "learn",
            figure: "keyboard-space",
            text: L("দুটি শব্দের মাঝে একবার Space চাপুন।", "Between two words, press Space once."),
          },
          {
            kind: "type",
            prompt: L("লিখুন: ami bhalo", "Type: good morning"),
            answer: L("ami bhalo", "good morning"),
            explain: L("দুই শব্দের মাঝে একবার Space চাপুন।", "Press Space once between the two words."),
          },
          {
            kind: "learn",
            figure: "keyboard-shift",
            text: L(
              "বড় হাতের অক্ষর (যেমন D) লিখতে Shift চেপে ধরে রেখে অক্ষরটি চাপুন, তারপর দুটোই ছেড়ে দিন।",
              "For a capital letter (like D), hold Shift down and press the letter, then let go of both.",
            ),
          },
          {
            kind: "tap",
            on: "keyboard",
            answer: "shift",
            prompt: L("ছবিতে Shift বোতামটি ছুঁয়ে দিন।", "Touch the Shift key on the picture."),
            explain: L("Shift বাঁ দিকে, নিচ থেকে দ্বিতীয় সারিতে।", "Shift is on the left, in the second row from the bottom."),
          },
          {
            kind: "type",
            prompt: L("লিখুন: Dhaka (D বড় হাতের)", "Type: Dhaka (with a capital D)"),
            answer: L("Dhaka", "Dhaka"),
            caseSensitive: true,
            explain: L("Shift চেপে ধরে D চাপুন, তারপর বাকি অক্ষরগুলো।", "Hold Shift and press D, then type the other letters."),
          },
          {
            kind: "choice",
            prompt: L("Shift কী কাজে লাগে?", "What is Shift for?"),
            options: [
              { correct: true, text: L("বড় হাতের অক্ষর লিখতে", "Typing capital letters") },
              {
                text: L("অক্ষর মুছতে", "Rubbing out letters"),
                hint: L("মোছার কাজ করে Backspace।", "Backspace is the one that rubs out."),
              },
              {
                text: L("নতুন লাইন শুরু করতে", "Starting a new line"),
                hint: L("নতুন লাইন শুরু করে Enter।", "Enter starts a new line."),
              },
            ],
          },
          {
            kind: "type",
            prompt: L("শেষ কাজ — লিখুন: Bangladesh", "Last one — type: Bangladesh"),
            answer: L("Bangladesh", "Bangladesh"),
            caseSensitive: true,
            explain: L("প্রথম B বড় হাতের: Shift চেপে ধরে B চাপুন।", "The first B is a capital: hold Shift and press B."),
          },
        ],
      },
    ],
  },
  {
    id: "windows",
    app: "computer",
    title: L("Windows-এর সাথে পরিচয়", "Getting to know Windows"),
    description: L("ডেস্কটপ, জানালা খোলা-বন্ধ আর কম্পিউটার নিরাপদে বন্ধ করা।", "The desktop, opening and closing windows, and turning the computer off safely."),
    lessons: [
      { id: "desktop", minutes: 4, title: L("ডেস্কটপ আর আইকন", "The desktop and icons") },
      { id: "windows", minutes: 5, title: L("জানালা খোলা ও বন্ধ করা", "Opening and closing windows") },
      { id: "turn-off", minutes: 4, title: L("নিরাপদে কম্পিউটার বন্ধ করা", "Turning the computer off safely") },
    ],
  },
  {
    id: "files",
    app: "files",
    title: L("ফাইল ও ফোল্ডার", "Files and folders"),
    description: L("আপনার কাজ কোথায় থাকে, আর কীভাবে আবার খুঁজে পাবেন।", "Where your work is kept, and how to find it again."),
    lessons: [
      { id: "what-is-a-file", minutes: 4, title: L("ফাইল কী?", "What is a file?") },
      { id: "make-a-folder", minutes: 5, title: L("নতুন ফোল্ডার বানানো", "Making a new folder") },
      { id: "find-a-file", minutes: 5, title: L("হারানো ফাইল খুঁজে পাওয়া", "Finding a lost file") },
    ],
  },
  {
    id: "internet-safety",
    app: "internet",
    title: L("নিরাপদে ইন্টারনেট", "The internet, safely"),
    description: L("ওয়েবসাইট খোলা, কিছু খোঁজা, আর প্রতারণা ও ভুয়া ফোন চেনা।", "Opening websites, searching, and spotting scams and fake calls."),
    lessons: [
      { id: "browser", minutes: 4, title: L("ব্রাউজার কী?", "What is a browser?") },
      { id: "search", minutes: 5, title: L("Google-এ কিছু খোঁজা", "Searching on Google") },
      { id: "fake-prizes", minutes: 5, title: L("ভুয়া পুরস্কারের মেসেজ চেনা", "Spotting fake prize messages") },
      { id: "fake-calls", minutes: 5, title: L("ভুয়া বিকাশ ও নগদ কল চেনা", "Spotting fake bKash and Nagad calls") },
    ],
  },
  {
    id: "whatsapp-email",
    app: "email",
    title: L("হোয়াটসঅ্যাপ ও ইমেইল", "WhatsApp and email"),
    description: L("ছেলেমেয়েদের সাথে ভিডিও কল, ছবি পাঠানো, আর ইমেইল।", "Video calls with your children, sending photos, and email."),
    lessons: [
      { id: "video-call", minutes: 5, title: L("হোয়াটসঅ্যাপে ভিডিও কল", "A video call on WhatsApp") },
      { id: "photo", minutes: 5, title: L("ছবি খোলা আর পাঠানো", "Opening and sending a photo") },
      { id: "read-email", minutes: 5, title: L("ইমেইল পড়া", "Reading an email") },
      { id: "write-email", minutes: 5, title: L("ইমেইল লিখে পাঠানো", "Writing and sending an email") },
    ],
  },
  {
    id: "word",
    app: "word",
    title: L("মাইক্রোসফট ওয়ার্ড", "Microsoft Word"),
    description: L("চিঠি আর দরখাস্ত লেখা, সেভ আর প্রিন্ট করা।", "Writing letters and applications, saving and printing."),
    lessons: [
      { id: "first-letter", minutes: 6, title: L("প্রথম চিঠি: মোটা, বড় আর সেভ", "Your first letter: bold, bigger and saved") },
      { id: "open-letter", minutes: 4, title: L("সেভ করা চিঠি আবার খোলা", "Opening a saved letter") },
      { id: "print", minutes: 4, title: L("চিঠি প্রিন্ট করা", "Printing your letter") },
    ],
  },
  {
    id: "excel",
    app: "excel",
    title: L("মাইক্রোসফট এক্সেল", "Microsoft Excel"),
    description: L("সহজ তালিকা বানানো আর হিসাব যোগ করা।", "Making simple lists and adding up numbers."),
    lessons: [
      { id: "what-is-excel", minutes: 4, title: L("এক্সেল কী?", "What is Excel?") },
      { id: "bazar-list", minutes: 5, title: L("বাজারের তালিকা বানানো", "Making a shopping list") },
      { id: "add-up", minutes: 5, title: L("খরচ যোগ করা", "Adding up what you spent") },
    ],
  },
  {
    id: "powerpoint",
    app: "powerpoint",
    title: L("মাইক্রোসফট পাওয়ারপয়েন্ট", "Microsoft PowerPoint"),
    description: L("লেখা আর ছবি দিয়ে সহজ স্লাইড বানানো।", "Making simple slides with words and photos."),
    lessons: [
      { id: "what-is-a-slide", minutes: 4, title: L("স্লাইড কী?", "What is a slide?") },
      { id: "first-slide", minutes: 5, title: L("প্রথম স্লাইড বানানো", "Making your first slide") },
      { id: "add-photo", minutes: 5, title: L("স্লাইডে ছবি যোগ করা", "Adding a photo to a slide") },
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

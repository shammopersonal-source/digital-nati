// Where each photo in public/photos/ comes from. Shown on the /credits page.
// Keep this in step with public/photos/CREDITS.md.

export type PhotoCredit = {
  file: string;
  title: string;
  author: string;
  licence: string;
  licenceUrl: string;
  source: string;
};

export const photoCredits: PhotoCredit[] = [
  {
    file: "mouse.jpg",
    title: "Generic computer mouse with scrollwheel",
    author: "Peter Astbury",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "https://commons.wikimedia.org/wiki/File:Generic_computer_mouse_with_scrollwheel.jpg",
  },
  {
    file: "mouse-hand.jpg",
    title: "Hand on the computer mouse",
    author: "Nenad Stojkovic",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Hand_on_the_computer_mouse_-_50202556601.jpg",
  },
  {
    file: "keyboard.jpg",
    title: "Dell SK-8115 keyboard",
    author: "Maarten Tromp",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "https://commons.wikimedia.org/wiki/File:Dell-SK-8115-keyboard_(52512065638).jpg",
  },
  {
    file: "monitor.jpg",
    title: "Dell Computer Monitor",
    author: "IT Photography",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Dell_Computer_Monitor.png",
  },
  {
    file: "printer.jpg",
    title: "HP LaserJet 1100",
    author: "Norsk Teknisk Museum",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:HP_LaserJet_1100_(cropped).jpg",
  },
];

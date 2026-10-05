// A small set of line icons. Always used next to a text label, never alone.

const paths = {
  phone:
    "M6.6 3.5 9 3l1.6 4.3-2 1.4a11 11 0 0 0 6.7 6.7l1.4-2L21 15l-.5 2.4c-.2 1-1.1 1.7-2.1 1.6C10.5 18.5 5.5 13.5 5 5.6c-.1-1 .6-1.9 1.6-2.1Z",
  chat: "M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z M9 10.3c.4 1.8 2 3.5 3.9 4.1l1.1-1.1 1.6.8M9 10.3l1.1-1.1-.7-1.6",
  arrowLeft: "M19 12H5m0 0 6-6m-6 6 6 6",
  arrowRight: "M5 12h14m0 0-6-6m6 6-6 6",
  check: "m4.5 12.5 5 5 10-11",
  play: "M8 5.5v13l10.5-6.5Z",
  pause: "M8 5.5v13M16 5.5v13",
  replay: "M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4",
  print: "M7 9V3.5h10V9M7 17H4.5V9h15v8H17M7 14h10v6.5H7Z",
  speaker: "M4 9.5h3.5L12 5.5v13l-4.5-4H4ZM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  stop: "M7 7h10v10H7Z",
  share: "M8.5 13.5l7-4M8.5 10.5l7 4M6 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm12-6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z",
  close: "M6 6l12 12M18 6 6 18",
  question: "M9.2 9.2a2.9 2.9 0 1 1 3.9 2.7c-.7.3-1.1.9-1.1 1.6v.8M12 17.6v.1M12 21.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Z",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  const filled = name === "play";
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 1.5 : 2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}

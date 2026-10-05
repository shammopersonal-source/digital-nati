/**
 * Lessons and brush-up sessions: no menu or footer, so nothing distracts.
 * The lesson's own top bar has "Stop the lesson" and "Need help?".
 */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen flex-1 flex-col">{children}</main>;
}

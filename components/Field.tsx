import type { ComponentProps } from "react";

/** A labelled text box with an optional hint and a calm error message. */
export default function Field({
  id,
  label,
  hint,
  error,
  ...input
}: { id: string; label: string; hint?: string; error?: string | null } & ComponentProps<"input">) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-lg font-bold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-ink-soft">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 block w-full max-w-md rounded-md border-2 bg-white px-4 py-3 text-xl ${
          error ? "border-brick" : "border-ink"
        }`}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 max-w-md border-l-4 border-brick bg-brick-wash px-3 py-2 text-brick-text">
          {error}
        </p>
      )}
    </div>
  );
}

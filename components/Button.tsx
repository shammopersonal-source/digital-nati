import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-[2.8rem] items-center justify-center gap-3 rounded-md border-2 px-6 py-2 text-center text-lg font-bold leading-snug no-underline select-none active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "border-green bg-green text-white hover:border-green-dark hover:bg-green-dark",
  secondary: "border-ink bg-white text-ink hover:bg-paper-deep",
};

export const buttonClass = (variant: Variant = "primary", extra = "") =>
  `${base} ${variants[variant]} ${extra}`;

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}

type LinkProps = {
  href: ComponentProps<typeof Link>["href"];
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", className = "", children }: LinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

/** For phone, WhatsApp and other outside links. */
export function ButtonAnchor({
  variant = "primary",
  className = "",
  ...rest
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={buttonClass(variant, className)} {...rest} />;
}

/** A plain underlined link that is still big enough to tap. */
export function TextLink({
  href,
  className = "",
  children,
}: {
  href: ComponentProps<typeof Link>["href"];
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-link inline-flex min-h-[2.8rem] items-center text-lg font-bold ${className}`}
    >
      {children}
    </Link>
  );
}

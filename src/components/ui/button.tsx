import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({ asChild = false, variant = "primary", className, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "border-[var(--rust)] bg-[var(--rust)] text-white hover:bg-[var(--rust-dark)]",
        variant === "secondary" && "hairline bg-white text-[var(--foreground)] hover:bg-[var(--paper)]",
        variant === "ghost" && "border-transparent bg-transparent text-[var(--muted)] hover:bg-white",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

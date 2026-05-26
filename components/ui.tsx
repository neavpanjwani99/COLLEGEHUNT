"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Button({
  className,
  variant = "primary",
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; asChild?: boolean }) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium";
  const styles = {
    primary: "bg-[#006AFF] text-white",
    secondary: "border border-[#E5E7EB] bg-white text-[#374151]",
    ghost: "text-[#374151]",
  };
  return <button className={cn(base, styles[variant], className)} {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none", props.className)} />;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-[#E5E7EB] bg-white shadow-card", className)}>{children}</div>;
}

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full border border-[#E5E7EB] px-2.5 py-1 text-xs font-medium text-[#374151]", className)}>{children}</span>;
}

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-[#374151]">
      {children}
    </Link>
  );
}

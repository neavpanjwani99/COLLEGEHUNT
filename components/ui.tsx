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
  const base = "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-150";
  const styles = {
    primary: "bg-[#FF385C] text-white hover:bg-[#E61E4D]",
    secondary: "border border-[#E5E7EB] bg-white text-[#222222] hover:bg-[#F7F7F7]",
    ghost: "text-[#222222] hover:bg-[#F7F7F7]",
  };
  return <button className={cn(base, styles[variant], className)} {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-full border border-[#DDDDDD] px-4 py-3 text-sm outline-none focus:border-[#222222]", props.className)} />;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white shadow-card hover:shadow-md transition-shadow", className)}>{children}</div>;
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

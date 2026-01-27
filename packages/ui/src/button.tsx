"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  className = "",
  appName,
  variant = "secondary"
}: ButtonProps) => {
  const base = "appearance-none rounded-full h-12 px-5 border border-transparent transition-all cursor-pointer flex items-center justify-center text-base font-medium font-sans";
  const variants = {
    primary: "bg-foreground text-background hover:bg-button-primary-hover",
    secondary: "border-gray-alpha-200 min-w-[180px] hover:bg-button-secondary-hover",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};

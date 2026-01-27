import { type JSX } from "react";

export function Card({
  className = "",
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={`group rounded-xl border border-gray-alpha-200 p-5 transition-colors hover:border-foreground hover:bg-gray-alpha-100 ${className}`}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="mb-2 text-lg font-semibold">
        {title}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1">
          -&gt;
        </span>
      </h2>
      <p className="m-0 text-sm opacity-60">{children}</p>
    </a>
  );
}

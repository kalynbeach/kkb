import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@kkb/ui/components/theme-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const berkeleyMono = localFont({
  src: "./fonts/TX-02-VF.woff2",
  variable: "--font-berkeley-mono",
});

export const metadata: Metadata = {
  title: "KKB",
  description: "@kkb/web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${berkeleyMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import { ThemeProvider } from "@kkb/ui/components/theme-provider";
import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const tx02 = localFont({
  src: "./fonts/TX-02-VF.woff2",
  variable: "--font-tx-02",
});

const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

const mekzantine = localFont({
  src: "./fonts/MEKZANTINE-Regular.woff2",
  variable: "--font-mekzantine",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "KKB Docs",
  description: "@kkb/docs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${tx02.variable} ${departureMono.variable} ${mekzantine.variable} ${ebGaramond.variable}`}
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

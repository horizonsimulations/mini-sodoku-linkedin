import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { TopNav } from "@/components/TopNav";
import { CookieBanner } from "@/components/CookieBanner";
import { CONSENT_COOKIE } from "@/lib/cookie-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Mini Sudoku Archive · Community LinkedIn Levels";
const description =
  "Open-source recreation of LinkedIn's Mini Sudoku featuring a daily archive, hints, and a built-in level builder.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://mini-sodoku-linkedin.vercel.app"),
  openGraph: {
    title,
    description,
    url: "https://mini-sodoku-linkedin.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialConsent =
    cookieStore.get(CONSENT_COOKIE)?.value === "granted";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        <TopNav />
        {children}
        <CookieBanner initialConsent={Boolean(initialConsent)} />
      </body>
    </html>
  );
}

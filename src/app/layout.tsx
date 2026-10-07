import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GradGuide - AI Course Recommendation Assistant Co-Pilot",
  description:
    "Real-time Google Meet course recommendation assistant co-pilot for study abroad counsellors with live note context extraction, smart admission tiering, and side-by-side trade-off matrix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}

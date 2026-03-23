import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ClawGeeks - AI Agents That Work For You",
  description:
    "Deploy personal AI agents with Telegram, Slack, Gmail, GitHub and more. Smart model routing, tool integrations, and 24/7 availability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("admin-theme");if(t==="light")document.documentElement.setAttribute("data-theme","light");else if(t==="system"||!t){if(window.matchMedia("(prefers-color-scheme:light)").matches)document.documentElement.setAttribute("data-theme","light")};}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} bg-atmosphere`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/content/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Headings: a sober text serif with optical sizes, so large titles get finer detailing.
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export const viewport: Viewport = {
  // Light by default; ThemeToggle switches this when a visitor picks the dark theme.
  themeColor: "#f7f6f2",
};

// Runs before paint: marks JS as available and applies a saved dark theme without a flash.
// The site is light unless the visitor has chosen dark with the toggle.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('theme')==='dark'){d.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}

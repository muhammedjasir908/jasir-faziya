import type { Metadata, Viewport } from "next";
import { Amiri, Ballet, EB_Garamond, Great_Vibes, Libre_Caslon_Display, Montserrat, Outfit } from "next/font/google";

import "./globals.css";

const display = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const arabic = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const ballet = Ballet({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ballet",
  display: "swap",
});

const caslon = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caslon",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Muhammed Jasir & Faziya Sherin",
    template: "%s · Jasir & Faziya",
  },
  description:
    "The wedding invitation of Muhammed Jasir and Faziya Sherin on 7 December 2026.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1c0d10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${arabic.variable} ${sans.variable} ${script.variable} ${ballet.variable} ${caslon.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { LoaderProvider } from "@/components/loader-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0b0b11",
};

export const metadata: Metadata = {
  title: "Luxa — Make your money feel clear again",
  description:
    "Luxa turns the noise of your spending into a calm picture: pockets for every euro, subscriptions under control, and Stella — a small star who notices what matters. No bank connection required.",
  keywords: [
    "budget app",
    "personal finance",
    "budget pockets",
    "50/30/20 method",
    "subscriptions tracker",
    "expense tracker",
    "Stella",
    "Luxa",
  ],
  authors: [{ name: "Luxa Team" }],
  creator: "Luxa",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luxa.app",
    title: "Luxa — Make your money feel clear again",
    description:
      "Pockets for every euro, subscriptions under control, and Stella who notices what matters. Budgeting that feels calm, clear and human.",
    siteName: "Luxa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxa — Make your money feel clear again",
    description:
      "Pockets for every euro, subscriptions under control, and Stella who notices what matters.",
    creator: "@luxa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${jakarta.variable} ${bricolage.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <LanguageProvider>
          <LoaderProvider>{children}</LoaderProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

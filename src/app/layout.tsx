import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxa - Prenez le contrôle de votre argent, sans stress",
  description: "Luxa est l'application de gestion de budget personnel qui applique la méthode 50/30/20, suit vos dépenses en temps réel et vous aide à atteindre vos objectifs d'épargne. Multi-devises, multi-langues, sécurisée.",
  keywords: ["budget", "gestion financière", "épargne", "méthode 50 30 20", "finances personnelles", "luxa"],
  authors: [{ name: "Luxa Team" }],
  creator: "Luxa",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://luxa.app",
    title: "Luxa - Prenez le contrôle de votre argent, sans stress",
    description: "L'application de gestion de budget qui applique la méthode 50/30/20, suit vos dépenses en temps réel et vous aide à épargner sans effort.",
    siteName: "Luxa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxa - Prenez le contrôle de votre argent, sans stress",
    description: "L'application de gestion de budget qui applique la méthode 50/30/20, suit vos dépenses en temps réel et vous aide à épargner sans effort.",
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
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

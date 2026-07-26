import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { LoaderProvider } from "@/components/loader-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { LANGUAGE_COOKIE, resolveLanguage, type Language } from "@/lib/i18n/config";
import { siteConfig, APP_STORE_URL } from "@/constants/site";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
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

const meta = { en: en.meta, fr: fr.meta };

/**
 * Resolve the visitor's language before anything renders: the cookie set by
 * the language toggle first, then the browser's Accept-Language. Doing this on
 * the server is what keeps the markup, the <html lang> and the metadata all
 * telling the same story.
 */
async function getLanguage(): Promise<Language> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  return resolveLanguage(
    cookieStore.get(LANGUAGE_COOKIE)?.value,
    headerList.get("accept-language")
  );
}

export const viewport: Viewport = {
  // Same black the app paints its screens with (DarkColors.background),
  // so the browser chrome doesn't draw a seam above the page.
  themeColor: "#000000",
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const copy = meta[language];

  return {
    // Without this, every relative OG/Twitter image URL resolves to nothing
    // and shared links render as an empty card.
    metadataBase: new URL(siteConfig.url),
    title: copy.title,
    description: copy.description,
    keywords: [
      "budget app",
      "application budget",
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
    applicationName: siteConfig.name,
    icons: {
      icon: "/icon.png",
      apple: "/icon.png",
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: language === "fr" ? "fr_FR" : "en_US",
      alternateLocale: language === "fr" ? "en_US" : "fr_FR",
      url: siteConfig.url,
      title: copy.title,
      description: copy.ogDescription,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.ogDescription,
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
}

/**
 * Tells Google this is an iOS app with a free tier, which is what surfaces the
 * price and platform in the results rather than a plain blue link.
 */
function StructuredData({ language }: { language: Language }) {
  const copy = meta[language];
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: copy.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "iOS",
    url: siteConfig.url,
    installUrl: APP_STORE_URL,
    inLanguage: language,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getLanguage();

  return (
    <html lang={language} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${bricolage.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <StructuredData language={language} />
        <LanguageProvider initialLanguage={language}>
          <LoaderProvider>{children}</LoaderProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

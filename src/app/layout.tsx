import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { LoaderProvider } from "@/components/loader-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { LANGUAGE_COOKIE, resolveLanguage, type Language } from "@/lib/i18n/config";
import { siteConfig, APP_STORE_URL, socialLinks } from "@/constants/site";
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
const locales = { en, fr };

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
    // Google ignores this tag, but Bing and several app directories still read
    // it. French first, because that is the market the page now serves.
    keywords:
      language === "fr"
        ? [
            "application budget",
            "gérer son budget",
            "méthode 50/30/20",
            "suivi des abonnements",
            "budget sans connexion bancaire",
            "application finances personnelles",
            "suivi des dépenses",
            "Luxa",
          ]
        : [
            "budget app",
            "50/30/20 method",
            "subscription tracker",
            "expense tracker",
            "personal finance app",
            "budgeting without bank connection",
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
 * Three graphs, one script tag.
 *
 * SoftwareApplication surfaces the price and platform in results instead of a
 * plain blue link. FAQPage is the one real rich-result opportunity on the page
 * — six genuine questions with genuine answers, already marked up as an
 * accordion — and it was not declared. Organization ties the social profiles to
 * the brand so they can be attributed.
 *
 * Everything is read from the locales, so the graph is always in the language
 * the page actually rendered in.
 */
function StructuredData({ language }: { language: Language }) {
  const copy = meta[language];
  const faqs = (locales[language].faq?.items ?? []) as Array<{
    question: string;
    answer: string;
  }>;

  const graph = [
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}#app`,
      name: siteConfig.name,
      description: copy.description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "iOS, Android",
      url: siteConfig.url,
      installUrl: APP_STORE_URL,
      inLanguage: language,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}#org`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.png`,
      sameAs: socialLinks.map((link) => link.href),
    },
    ...(faqs.length
      ? [
          {
            "@type": "FAQPage",
            "@id": `${siteConfig.url}#faq`,
            inLanguage: language,
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
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

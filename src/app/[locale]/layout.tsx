import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";
import { locales, isRtl, getDictionary } from "@/i18n/config";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { AssistantWidget } from "@/components/AssistantWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: `${dict.brand.name} — ${dict.brand.tagline}`,
    description: dict.home.heroSubtitle,
    manifest: "/manifest.json",
    icons: {
      icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
    },
    openGraph: {
      title: dict.brand.name,
      description: dict.home.heroSubtitle,
      type: "website"
    },
    alternates: {
      languages: { ar: "/ar", en: "/en", vi: "/vi" }
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <body>
        <Providers>
          <Navbar locale={locale} />
          <main className="min-h-[70vh]">{children}</main>
          <Footer locale={locale} />
          <AssistantWidget locale={locale} />
        </Providers>
      </body>
    </html>
  );
}

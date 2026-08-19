import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";
import { LayoutShell } from "@/components/LayoutShell";

/**
 * Ikkita font family — ko'proq ishlatilmaydi.
 * Inter: butun interfeys matni. Cormorant Garamond: logo va sarlavhalar.
 */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * OG va Twitter rasmlarining to'liq URL'i shu manzildan yasaladi.
 * Railway `RAILWAY_PUBLIC_DOMAIN` ni o'zi beradi; boshqa muhitda
 * `NEXT_PUBLIC_SITE_URL` ni qo'lda o'rnatish mumkin.
 */
function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (railway) return new URL(`https://${railway}`);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "AVERA — ayollar sumkalari va charm aksessuarlar",
    template: "%s · AVERA",
  },
  description:
    "AVERA — tabiiy charmdan tayyorlangan ayollar sumkalari, ryukzaklar va hamyonlar. Toshkent bo'ylab yetkazib berish.",
  applicationName: "AVERA",
  keywords: ["sumka", "charm sumka", "ayollar sumkasi", "ryukzak", "hamyon", "AVERA", "Toshkent"],
  openGraph: {
    title: "AVERA — ayollar sumkalari va charm aksessuarlar",
    description:
      "Tabiiy charmdan tayyorlangan sumkalar, ryukzaklar va hamyonlar. Minimal, elegant, premium.",
    siteName: "AVERA",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVERA — ayollar sumkalari va charm aksessuarlar",
    description: "Tabiiy charmdan tayyorlangan sumkalar, ryukzaklar va hamyonlar.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F5EFE6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${cormorant.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <I18nProvider>
          <StoreProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

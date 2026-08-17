import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";
import { LayoutShell } from "@/components/LayoutShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-brand",
  subsets: ["latin", "cyrillic"],
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "AVERA — charm sumkalar do'koni",
  description: "Original charm sumkalar onlayn do'koni. Toshkent bo'ylab 24 soatda yetkazamiz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${robotoCondensed.variable} antialiased`}
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

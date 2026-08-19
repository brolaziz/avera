"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCart } from "@/components/FloatingCart";
import { SiteProvider } from "@/lib/site";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteProvider>
      <div className="container-main">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      <FloatingCart />
    </SiteProvider>
  );
}

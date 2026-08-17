"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfirmModal } from "@/components/ConfirmModal";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="container-main">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
      <ConfirmModal />
    </>
  );
}

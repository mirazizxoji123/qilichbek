import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionConfig } from "framer-motion";

export const metadata: Metadata = {
  title: "QUICKSTAY — stays worth remembering",
  description: "Discover and book memorable stays across Uzbekistan and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>
        <LanguageProvider>
          <MotionConfig reducedMotion="user">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </MotionConfig>
        </LanguageProvider>
      </body>
    </html>
  );
}

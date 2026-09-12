/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/layout.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const APP_METADATA_BASE_URL = new URL("https://git-secret-sanitizer.local");
const APP_LOGO_ICON_URL = "https://z-cdn.chatglm.cn/z-ai/static/logo.svg";

export const metadata: Metadata = {
  title: "Git Secret & PII Sanitizer",
  description: "Deep PII and Secret Scanner for GitHub repositories.",
  icons: {
    icon: APP_LOGO_ICON_URL,
  },
  metadataBase: APP_METADATA_BASE_URL,
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

const DOCUMENT_BODY_INLINE_STYLES = {
  direction: "ltr" as const,
  textAlign: "left" as const,
  fontFamily: "var(--font-share-tech-mono), monospace",
};

/**
 * Root Application Layout Component
 * Configures global typography, theme states, and application container hierarchy.
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.staticfile.net/translate.js/3.2.1/translate.js"
          strategy="afterInteractive"
        />
        <Script id="translate-init" strategy="afterInteractive">
          {`
            window.addEventListener('load', () => {
              if (window.translate) {
                translate.selectLanguageTag.show = false;
                try {
                  var savedLang = localStorage.getItem('darlek_cann_language');
                  if (savedLang && typeof savedLang === 'string' && savedLang.length < 32 && savedLang !== 'english') {
                    translate.to = savedLang;
                  }
                } catch (e) {}
                translate.execute();
              }
            });
          `}
        </Script>
      </head>
      <body
        dir="ltr"
        className="antialiased min-h-screen bg-black text-[#e0e0e0] font-mono overflow-x-hidden m-0 p-0"
        style={DOCUMENT_BODY_INLINE_STYLES}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
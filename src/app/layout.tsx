import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Hoist static objects outside the module evaluation scope to prevent repeated allocations
const METADATA_BASE_URL = new URL("https://git-secret-sanitizer.local");
const LOGO_ICON_URL = "https://z-cdn.chatglm.cn/z-ai/static/logo.svg";

export const metadata: Metadata = {
  title: "Git Secret & PII Sanitizer",
  description: "Deep PII and Secret Scanner for GitHub repositories.",
  icons: {
    icon: LOGO_ICON_URL,
  },
  metadataBase: METADATA_BASE_URL,
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

// Pre-define immutable inline styles object to avoid per-render object allocation and GC pressure
const BODY_STYLE = {
  direction: "ltr" as const,
  textAlign: "left" as const,
  fontFamily: "var(--font-share-tech-mono), monospace",
};

/**
 * Root Application Layout Component
 * Optimized for high execution speed, zero redundant object allocations, and minimal memory footprint.
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <body
        dir="ltr"
        className="antialiased min-h-screen bg-black text-[#e0e0e0] font-mono overflow-x-hidden m-0 p-0"
        style={BODY_STYLE}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
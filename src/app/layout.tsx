import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Secret & PII Sanitizer",
  description: "Deep PII and Secret Scanner for GitHub repositories.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  metadataBase: new URL("https://git-secret-sanitizer.local"),
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

/**
 * Root Application Layout Component
 * Provides global typography, theme scaffolding, and structural context.
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <body
        dir="ltr"
        className="antialiased min-h-screen bg-black text-[#e0e0e0] font-mono overflow-x-hidden m-0 p-0"
        style={{
          direction: "ltr",
          textAlign: "left",
          fontFamily: "var(--font-share-tech-mono), monospace",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
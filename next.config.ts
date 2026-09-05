import type { NextConfig } from "next";

const nextConfig = {
  distDir: process.env.NODE_ENV === "production" ? ".next" : ".next_dev",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@prisma/client", "pdf-parse", "z-ai-web-dev-sdk", "mammoth"],
  async rewrites() {
    return [
      {
        source: "/:path((?!api|_next|static|favicon.ico).*)",
        destination: "/",
      },
    ];
  },
} as any;

export default nextConfig as NextConfig;

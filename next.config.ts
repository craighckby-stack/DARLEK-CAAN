import type { NextConfig } from "next";

/**
 * Environment-specific build output directory configuration.
 * Uses a separated directory for development to prevent cache collisions with production builds.
 */
const BUILD_OUTPUT_DIRECTORY: string = process.env.NODE_ENV === "production" ? ".next" : ".next_dev";

/**
 * List of server-only external packages that require native Node.js bundling behavior.
 */
const SERVER_EXTERNAL_PACKAGES: readonly string[] = [
  "@prisma/client",
  "pdf-parse",
  "z-ai-web-dev-sdk",
  "mammoth",
] as const;

const nextConfig: NextConfig = {
  distDir: BUILD_OUTPUT_DIRECTORY,
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  serverExternalPackages: [...SERVER_EXTERNAL_PACKAGES],

  async rewrites() {
    return [
      {
        source: "/:path((?!api|_next|static|favicon.ico).*)",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
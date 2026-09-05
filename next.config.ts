import type { NextConfig } from "next";

/**
 * Environment-specific build output directory configuration.
 * Uses a separated directory for development to prevent cache collisions with production builds.
 */
const BUILD_OUTPUT_DIRECTORY = process.env.NODE_ENV === "production" ? ".next" : ".next_dev";

/**
 * List of server-only external packages that require native Node.js bundling behavior.
 */
const SERVER_EXTERNAL_PACKAGES = [
  "@prisma/client",
  "pdf-parse",
  "z-ai-web-dev-sdk",
  "mammoth",
];

const nextConfig: NextConfig = {
  distDir: BUILD_OUTPUT_DIRECTORY,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  serverExternalPackages: SERVER_EXTERNAL_PACKAGES,

  async rewrites() {
    return [
      {
        // Redirect all non-API and non-asset routes to the root for single-page application handling
        source: "/:path((?!api|_next|static|favicon.ico).*)",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
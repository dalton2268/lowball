import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: false, // ✅ disables route param type-checking (causing the slug warning)
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ optional: true if you want to skip ALL type errors at build time
  },
};

export default nextConfig;

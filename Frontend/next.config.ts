import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Enables static HTML export
  output: "export",

  // ✅ Required since Next.js image optimization doesn’t work in static export
  images: {
    unoptimized: true,
  },

  // Optional – keep if you need it
  reactCompiler: true,
};

export default nextConfig;

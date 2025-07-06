import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;

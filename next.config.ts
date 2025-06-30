import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@/services": path.resolve(__dirname, "src/services"),
    };
    return config;
  },
};

export default nextConfig;

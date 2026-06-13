import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true, // 🌟 核心：开启 Next.js 强类型路由大招
  },
};

export default nextConfig;

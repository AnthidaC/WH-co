import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // ป้องกัน duplicate double render ใน dev
  images: {
    unoptimized: true, // รองรับ local images ได้เร็วและไม่กิน memory ใน Next.js image optimizer
  },
};

export default nextConfig;

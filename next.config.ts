import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.120"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
      },
    ],
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-da5da491b8f6438187beadbd77f396b9.r2.dev",
      },
    ],
  },
};

export default nextConfig;

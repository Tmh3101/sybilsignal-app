import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "api.grove.storage",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
      },
    ],
  },
};

export default nextConfig;

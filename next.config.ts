import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thiings.co",
      },
      {
        protocol: "https",
        hostname: "pub-940ccf6255b54fa799a9b01050e6c227.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.jim-nielsen.com",
      }
    ],
  },
};

export default nextConfig;

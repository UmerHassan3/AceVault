import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    // proxy.ts buffers every request body (auth gate runs on all routes); its
    // own 10MB default silently truncates multipart uploads before server
    // actions ever see them, independent of serverActions.bodySizeLimit above.
    proxyClientMaxBodySize: "20mb",
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import { redirects as redirectTable } from "./src/lib/site.config";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kaizenlaw.ca" }],
        destination: "https://www.kaizenlaw.ca/:path*",
        permanent: true,
      },
      ...redirectTable.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent,
      })),
    ];
  },
};

export default nextConfig;

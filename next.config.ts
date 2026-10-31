import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // League data is cached with "use cache" + cacheTag (src/lib/server/queries.ts)
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Reuse prefetched/visited dynamic pages for 30s so tab switches are instant.
    // Server actions (updateTag) and router.refresh() still bypass it.
    staleTimes: { dynamic: 30 },
    // Every page blocks on cookies by design (see `instant` in app/layout.tsx), so only
    // validate segments that explicitly opt in instead of warning on every page in dev.
    instantInsights: { validationLevel: "manual-warning" },
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

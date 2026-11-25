import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Serve uploaded files through the auth-aware route handler (ported from
  // web_hr-main). Keeps existing /uploads/* URLs working.
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
  // NOTE: cacheComponents / partialPrefetching intentionally disabled — this
  // app is fully per-request dynamic (cookie auth + live payroll/attendance),
  // matching the original web_hr-main runtime model.
  // Tailwind v4 is processed via PostCSS (postcss.config.mjs +
  // @tailwindcss/postcss) so the build is portable across hosts (the previous
  // custom @tailwindcss/turbopack loader rule panicked on the deploy host).
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Home is the showroom now; keep old /menu links (bookmarks, cached
    // clients) working instead of 404ing.
    return [{ source: "/menu", destination: "/", permanent: true }];
  },
};

export default nextConfig;

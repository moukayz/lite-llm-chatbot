import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // `next build` still trips over legacy `next lint` options in this repo's flat config setup.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // O-16 (2026-07-29): /coaching sold a product cut from the business
      // plan; the surface was repurposed as the recruiting advisory.
      { source: "/coaching", destination: "/recruiting", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;

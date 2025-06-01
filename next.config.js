/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Fix for 404 errors by ensuring proper static output
  output: 'export',
  
  // Improved page routing
  trailingSlash: false,
  
  // Custom asset prefix for CDN if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.ASSET_PREFIX || '' : '',
  
  // Optimize images further
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'mentneo.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
  
  // Fix experimental settings causing deployment errors
  experimental: {
    // Remove runtime setting that can cause edge function errors
    serverComponents: false,
    appDir: false,
  },
};

module.exports = nextConfig;

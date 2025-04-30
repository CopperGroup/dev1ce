/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
      domains: ['shop.juventa.ua', 'utfs.io', 'uploadthing.com', "www.sveamoda.com.ua", "sveamoda.com.ua"], // Add the external hostname here
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.rozetka.com.ua",
        },
      ],
      minimumCacheTTL: 31536000, // 1 year
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    // optimizeCss: true,
    optimizeServerReact: true,
  }
};

export default nextConfig;

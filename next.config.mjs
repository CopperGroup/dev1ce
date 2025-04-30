/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
      domains: [
        'utfs.io', 
        'uploadthing.com',  
        'content1.rozetka.com.ua',
        'content.rozetka.com.ua',
        'content2.rozetka.com.ua',
        'content3.rozetka.com.ua',
        'content4.rozetka.com.ua',
        'content5.rozetka.com.ua',
      ], // Add the external hostname here
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.rozetka.com.ua',
          pathname: '/goods/images/**',
        },
      ],
      minimumCacheTTL: 31536000, // 1 year
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    // optimizeCss: true,
    optimizeServerReact: true,
  },
  async rewrites() {
    return [
      {
        source: '/image-proxy/:path*',
        destination: 'https://content.rozetka.com.ua/:path*',
      },
      {
        source: '/image-proxy-1/:path*',
        destination: 'https://content1.rozetka.com.ua/:path*',
      },
      {
        source: '/image-proxy-2/:path*',
        destination: 'https://content2.rozetka.com.ua/:path*',
      },
      {
        source: '/image-proxy-3/:path*',
        destination: 'https://content3.rozetka.com.ua/:path*',
      },
      {
        source: '/image-proxy-4/:path*',
        destination: 'https://content4.rozetka.com.ua/:path*',
      },
      {
        source: '/image-proxy-5/:path*',
        destination: 'https://content5.rozetka.com.ua/:path*',
      },
    ]
  },
};

export default nextConfig;

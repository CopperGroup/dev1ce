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
          port: '',
          pathname: '/**',
        },
      ],
      minimumCacheTTL: 31536000,
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      unoptimized: false,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    // optimizeCss: true,
    largePageDataBytes: 128 * 1000,
    optimizeServerReact: true,
    
  },
};

export default nextConfig;

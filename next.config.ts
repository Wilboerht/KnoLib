import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 实验性功能
  experimental: {
    // 启用服务器组件
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
  },

  // 图片优化配置
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ];
  },

  // 重写配置
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 构建配置
  typescript: {
    // 在生产构建时忽略类型错误（不推荐，但可以用于快速部署）
    // ignoreBuildErrors: true,
  },

  eslint: {
    // 在生产构建时忽略 ESLint 错误（不推荐，但可以用于快速部署）
    // ignoreDuringBuilds: true,
  },

  // 输出配置
  output: 'standalone',

  // 压缩配置
  compress: true,

  // 性能优化
  poweredByHeader: false,

  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 优化包大小
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/blogs/:slug',
        destination: '/resources/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;

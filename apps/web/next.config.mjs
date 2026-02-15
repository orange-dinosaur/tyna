/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/web-ui'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'books.google.com',
            },
        ],
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/app/api/**'],
    };
    return config;
  },
};

export default nextConfig;
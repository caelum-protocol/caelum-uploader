/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
        options: {
          filename: 'static/chunks/[name].[contenthash].worker.js',
          esModule: false,
        },
      },
      {
        resourceQuery: /worker/,
        loader: 'worker-loader',
        options: {
          filename: 'static/chunks/[name].[contenthash].worker.js',
          esModule: false,
        },
      }
    );
    return config;
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this webpack config:
  webpack(config) {
    // Exclude Coinbase HeartbeatWorker from Terser/minification
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      issuer: /@coinbase[\\/]wallet-sdk/,
      use: [
        {
          loader: 'ignore-loader'
        }
      ]
    });
    return config;
  },
};

export default nextConfig;
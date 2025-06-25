/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.output.environment = {
      ...config.output.environment,
      module: true, // enable ESM for workers
    };
    config.output.globalObject = "self";
    return config;
  },
};

export default nextConfig;
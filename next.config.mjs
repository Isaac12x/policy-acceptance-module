import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const moduleEntry = path.resolve(__dirname, "../package/dist/index.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@fv/policy-acceptance-module"],
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@fv/policy-acceptance-module"] = moduleEntry;
    return config;
  },
  output: "export",
};

export default nextConfig;

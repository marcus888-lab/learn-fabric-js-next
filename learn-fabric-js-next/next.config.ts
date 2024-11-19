import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/fabric-js",
  assetPrefix: "/fabric-js/",
};

export default nextConfig;

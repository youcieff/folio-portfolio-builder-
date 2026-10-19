import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  // Keep production builds from overwriting active development chunks.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default config;

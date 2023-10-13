/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import withPWAInit from "@ducanh2912/next-pwa";
import pkg from './next-i18next.config.js';
const { i18n } = pkg;

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  i18n,
};

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA(nextConfig);

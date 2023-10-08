/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA(nextConfig);

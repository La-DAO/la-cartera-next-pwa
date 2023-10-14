/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import withPWAInit from "@ducanh2912/next-pwa";
import config from "./next-i18next.config.mjs";

/**
 * Generics give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    productionBrowserSourceMaps: true,
    i18n: config.i18n,
  })
);

/* eslint-disable @next/next/no-title-in-document-head */
import { ColorModeScript } from "@chakra-ui/color-mode";
import { Html, Head, Main, NextScript } from "next/document";
import theme from "~/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>LaCartera</title>
        <meta
          name="description"
          content="LaCartera Web3 para la Comunidad - desarrollada por LaDAO"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="msapplication-TileColor" content="#121210" />
        <meta name="theme-color" content="#0b0b0a" />
      </Head>
      <body>
        <ColorModeScript
          initialColorMode={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            theme.config.initialColorMode as
              | "light"
              | "dark"
              | "system"
              | undefined
          }
          key="chakra-ui-no-flash"
          storageKey="chakra-ui-color-mode"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { StrictMode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";

import { type AppType } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";

import { api } from "~/utils/api";
import theme from "~/theme";
import { chainsConfig } from "~/lib/wagmiPrivyClient";
import nextI18nConfig from "../../next-i18next.config.mjs";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PrivyProvider appId={PRIVY_APP_ID}>
      <PrivyWagmiConnector wagmiChainsConfig={chainsConfig}>
        <StrictMode>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </StrictMode>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
};

// @ts-expect-error - propTypes wtf???
const I18nApp = appWithTranslation(MyApp, nextI18nConfig);

export default api.withTRPC(I18nApp);

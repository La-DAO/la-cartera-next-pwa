import { StrictMode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";

import { type AppType } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { api } from "~/utils/api";
import theme from "~/theme";
import { chainsConfig } from "~/lib/wagmiPrivyClient";

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

export default api.withTRPC(MyApp);

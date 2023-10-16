import React from "react";
import { useRouter } from "next/router";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, withTranslation } from "next-i18next";
import nextI18nConfig from "../../next-i18next.config.mjs";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

import { PageWithAppBar } from "~/components/layout/AppBar";
import LoaderPage from "~/components/loader/LoaderPage";
import { truncateAddress } from "~/utils/string";

const appChainId = parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? "137");

const Login = () => {
  const { t } = useTranslation("common");
  const { push } = useRouter();
  const { ready, authenticated, logout } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  const { login } = useLogin({
    onComplete: (user, isNewUser) => {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      console.log("wallet activa!!", activeWallet);
      if (embeddedWallet) {
        setActiveWallet(embeddedWallet)
          .then((res) => console.log("SET ACTIVE WALLET!!!", res))
          .catch((error) => console.error(error));
      }
      void activeWallet?.switchChain(appChainId);
      if (isNewUser) {
        void push(`/u/${user.id.replace("did:privy:", "")}`);
      }
      void push(`/u/${user.id.replace("did:privy:", "")}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (!ready)
    return (
      <PageWithAppBar>
        <LoaderPage />
      </PageWithAppBar>
    );

  return (
    <PageWithAppBar>
      <Flex
        flexDirection="column"
        justifyContent="start"
        alignItems="center"
        h="100%"
        w="100%"
        pt={[12, null, 16]}
        pb={8}
        px={4}
        gap={8}
      >
        {!authenticated ? (
          <>
            <Heading as="h1" fontSize={["4xl"]} mt={[8, null, 0]}>
              {t("start_session")}
            </Heading>
            <Button
              size={["lg", null, null, "md"]}
              variant="primary"
              onClick={login}
              px={[null, null, 6, 8]}
            >
              {t("login_button")}
            </Button>
          </>
        ) : (
          <>
            <Heading as="h1" fontSize={["4xl"]}>
              {t("my_keys")}
            </Heading>
            <Box px={4} textAlign="left" w="100%">
              <Heading as="h2" fontSize="2xl" mb={2}>
                {t("active_key")}:
              </Heading>
              <Text fontSize="xl" fontWeight="medium" ml={2}>
                {truncateAddress(activeWallet?.address, 12, 10)}
              </Text>
            </Box>
            <Box px={4} textAlign="left" w="100%">
              <Heading as="h2" fontSize="2xl" mb={4}>
                {t("connected_keys")}
              </Heading>
              <List>
                {wallets.map((wallet) => (
                  <ListItem key={wallet.address}>
                    <Grid templateColumns="repeat(3, 1fr)">
                      <GridItem
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        colSpan={2}
                      >
                        <Text fontSize="xl" fontWeight="medium">
                          {truncateAddress(wallet.address, 6, 6)}
                        </Text>
                      </GridItem>
                      <GridItem px={2}>
                        {wallet.address === activeWallet?.address ? (
                          <Button variant="outline" isDisabled={true} w="100%">
                            {t("active_state")}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            w="100%"
                            onClick={() => void setActiveWallet(wallet)}
                          >
                            {t("activate_button")}
                          </Button>
                        )}
                      </GridItem>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box py={8}>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => void logout()}
              >
                {t("logout_button")}
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </PageWithAppBar>
  );
};

export default withTranslation("common")(Login);

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

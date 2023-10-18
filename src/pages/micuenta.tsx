import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useRouter } from "next/router";
import { isAddress } from "viem";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, withTranslation } from "next-i18next";
import nextI18nConfig from "../../next-i18next.config.mjs";
import { privyWagmiWalletToSigner } from "../contracts/wagmiAdapters";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { PageWithAppBar } from "~/components/layout/AppBar";
import LoaderPage from "~/components/loader/LoaderPage";
import { truncateAddress } from "~/utils/string";
import { Link } from "@chakra-ui/next-js";

import { useWalletClient } from "wagmi";
import {
  createUserPaidNewSafeAccount,
  getUserAssociatedSafeAccounts,
} from "../contracts/safeAccount/safeAccountUtils";
import { type BalanceMap, readXocBalance, sendGaslessXoc } from "~/contracts/xocolatl/xocolatlUtils";

const appChainId = parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? "137");

const MiCuenta = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateWallet, setIsLoadingCreateWallet] = useState(false);
  const [isMounted] = useState(false);
  const [safes, setSafes] = useState<string[]>([]);
  const [xocBalance, setXocBalance] = useState<BalanceMap>({});

  const { push } = useRouter();
  const { ready, authenticated, logout, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { refetch: refetchWalletClient } = useWalletClient();

  const embeddedWallets = wallets.filter(
    (wallet) =>
      wallet.connectorType === "embedded" && wallet.walletClientType === "privy"
  );

  useEffect(() => {
    const buildListOfUserSafes = async () => {
      if (!activeWallet) return;
      const ethersSigner = await privyWagmiWalletToSigner(
        activeWallet,
        appChainId
      );
      const safes = await getUserAssociatedSafeAccounts(ethersSigner);
      setSafes(safes);
    };

    if (!isMounted) {
      void buildListOfUserSafes();
    }
  }, [activeWallet, isMounted]);

  useEffect(() => {
    const getXocBalances = async () => {
      if (!activeWallet || !safes || safes.length === 0) return;
      const ethersSigner = await privyWagmiWalletToSigner(
        activeWallet,
        appChainId
      );
      const balances: BalanceMap = {}
      for (const safe of safes) {
        console.log('safe', safes);
        const bal = await readXocBalance(safe, ethersSigner.provider);
        console.log('bal del safe', bal);
        if (bal != null) {
          balances[safe] = bal;
        }
      }
      setXocBalance(balances)
    }

    if (!isMounted) {
      void getXocBalances();
    }
  }, [activeWallet, isMounted, safes]);

  const handleCreateKey = async () => {
    setIsLoadingCreateWallet(true);
    try {
      await createWallet();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCreateWallet(false);
    }
  };

  const handleCreateSafeAccount = async () => {
    setIsLoadingCreateWallet(true);
    try {
      await refetchWalletClient();
      if (!activeWallet) return;
      const ethersSigner = await privyWagmiWalletToSigner(
        activeWallet,
        appChainId
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await createUserPaidNewSafeAccount(ethersSigner);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCreateWallet(false);
    }
  };

  const handleGaslessSendXoc = async () => {
    if (!safes || safes.length === 0) throw "This wallet owns no Safe"
    const userReceiverInput = prompt("Please enter an address:")!;
    if (!isAddress(userReceiverInput)) throw "Enter valid address";
    const amountInput = prompt("Please amount to send:")!;
    console.log("happy", userReceiverInput, amountInput);
    try {
      await refetchWalletClient();
      if (!activeWallet) return;
      const ethersSigner = await privyWagmiWalletToSigner(
        activeWallet,
        appChainId
      );
      await sendGaslessXoc(
        ethersSigner,
        safes[0]!,
        userReceiverInput,
        amountInput
      );
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      await push("/ingresar");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    if (!activeWallet) return;
    try {
      await activeWallet.switchChain(137);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      void push("/ingresar");
    }
    if (ready) {
      void activeWallet?.switchChain(appChainId);
      void refetchWalletClient();
    }
  }, [activeWallet, authenticated, push, ready, refetchWalletClient]);

  if (!ready)
    return (
      <PageWithAppBar>
        <LoaderPage />
      </PageWithAppBar>
    );

  return (
    <PageWithAppBar>
      <Flex justifyContent="center" h="100%" w="100%">
        <Flex
          flexDirection="column"
          justifyContent="start"
          alignItems="center"
          h="100%"
          w={["100%", null, "75%", "60%", "50%"]}
          pt={[12, null, 16]}
          pb={8}
          px={4}
          gap={8}
        >
          {authenticated ? (
            <>
              <Heading as="h1" fontSize={["4xl"]}>
                {t("my_keys")}
              </Heading>
              <Box px={4} textAlign="left" w="100%">
                <Heading as="h2" fontSize="2xl" mb={2}>
                  {t("active_key")}:
                </Heading>
                <Flex
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text
                    display={["block", null, null, null, "none"]}
                    fontSize="xl"
                    fontWeight="medium"
                    ml={2}
                    gap={4}
                  >
                    {activeWallet
                      ? truncateAddress(activeWallet.address, 12, 10)
                      : t("warn_no_active_key")}
                  </Text>
                  <Text
                    display={["none", null, null, null, "block"]}
                    fontSize="xl"
                    fontWeight="medium"
                    ml={2}
                    gap={4}
                  >
                    {activeWallet
                      ? activeWallet.address
                      : t("warn_no_active_key")}
                  </Text>
                  {activeWallet && (
                    <Link
                      href={`https://polygonscan.com/address/${activeWallet.address}`}
                      target="_blank"
                    >
                      <IconButton
                        aria-label="External link"
                        variant="unstyled"
                        icon={<ExternalLinkIcon h={5} w={5} mb={1} />}
                      />
                    </Link>
                  )}
                </Flex>
                {activeWallet?.chainId !== "eip155:137" && (
                  <Flex justifyContent="center" mt={4} w="100%">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleSwitchNetwork}
                    >
                      {t("change_network_button")}
                    </Button>
                  </Flex>
                )}
              </Box>
              <Box px={4} textAlign="left" w="100%">
                <Heading as="h2" fontSize="2xl" mb={4}>
                  {t("available_keys")}
                </Heading>
                {wallets.length === 0 ? (
                  <Text fontSize="xl" ml={2}>
                    {t("warn_no_keys")}
                  </Text>
                ) : (
                  <List>
                    {wallets.map((wallet) => (
                      <ListItem key={wallet.address}>
                        <Grid templateColumns="repeat(3, 1fr)">
                          <GridItem
                            display="flex"
                            alignItems="center"
                            justifyContent="left"
                            colSpan={2}
                          >
                            <Text
                              display={["block", null, null, null, "none"]}
                              fontSize="xl"
                              fontWeight="medium"
                              ml={2}
                            >
                              {truncateAddress(wallet.address, 6, 6)}
                            </Text>
                            <Text
                              display={["none", null, null, null, "block"]}
                              fontSize="xl"
                              fontWeight="medium"
                              ml={2}
                            >
                              {truncateAddress(wallet.address, 14, 12)}
                            </Text>
                          </GridItem>
                          <GridItem px={2}>
                            {wallet.address === activeWallet?.address ? (
                              <Button
                                variant="outline"
                                isDisabled={true}
                                w="100%"
                              >
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
                )}
                {embeddedWallets?.length === 0 && (
                  <Flex justifyContent="center" mt={12} w="100%">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCreateKey}
                      isDisabled={!(ready && authenticated)}
                      isLoading={isLoadingCreateWallet}
                      loadingText="Creando..."
                      spinnerPlacement="end"
                    >
                      {t("create_key_button")}
                    </Button>
                  </Flex>
                )}
              </Box>
              <Box mt={4}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleLogout}
                  isLoading={isLoading}
                  loadingText={t("loader_msg_closing")}
                  spinnerPlacement="end"
                >
                  {t("logout_button")}
                </Button>
              </Box>
              <Box mt={4}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleCreateSafeAccount}
                  isLoading={isLoading}
                  loadingText={t("loader_msg_closing")}
                  spinnerPlacement="end"
                >
                  {t("create_safeaccount_button")}
                </Button>
              </Box>
              <Heading as="h1" fontSize={["4xl"]}>
                {t("my_safe_accounts")}
              </Heading>
              <List>
                {
                  safes.map(safe => (
                    <ListItem key={safe}>
                      <Grid templateColumns="repeat(3, 1fr)">
                        <GridItem
                          display="flex"
                          alignItems="center"
                          justifyContent="left"
                          colSpan={2}
                        >
                          <Text
                            display={["block", null, null, null, "none"]}
                            fontSize="xl"
                            fontWeight="medium"
                            ml={2}
                          >
                            {truncateAddress(safe, 6, 6)}
                          </Text>
                          <Text
                            display={["none", null, null, null, "block"]}
                            fontSize="xl"
                            fontWeight="medium"
                            ml={2}
                          >
                            {truncateAddress(safe, 14, 12)}
                          </Text>
                        </GridItem>
                        <GridItem
                          display="flex"
                          alignItems="right"
                          justifyContent="right"
                          colSpan={1}
                        >
                          <Text fontSize="xl" fontWeight="medium" ml={2}>
                            {`Xoc Balance: ${xocBalance[safe] as string}`}
                          </Text>
                        </GridItem>
                      </Grid>
                    </ListItem>

                  ))
                }
              </List>
              <Box mt={4}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleGaslessSendXoc}
                  isLoading={isLoading}
                  loadingText={t("loader_msg_closing")}
                  spinnerPlacement="end"
                >
                  {t("send_xoc")}
                </Button>
              </Box>
            </>
          ) : (
            <LoaderPage text={t("loader_msg_redirecting")} />
          )}
        </Flex>
      </Flex>
    </PageWithAppBar>
  );
};

export default withTranslation("common")(MiCuenta);

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

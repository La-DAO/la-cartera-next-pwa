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
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { PageWithAppBar } from "~/components/layout/AppBar";
import LoaderPage from "~/components/loader/LoaderPage";
import { truncateAddress } from "~/utils/string";
import { Link } from "@chakra-ui/next-js";

import { api } from "~/utils/api";

import { useWalletClient } from "wagmi";
import {
  createUserPaidNewSafeAccount,
  getUserAssociatedSafeAccounts,
} from "../contracts/safeAccount/safeAccountUtils";
import {
  type BalanceMap,
  readXocBalance,
  sendGaslessXoc,
} from "~/contracts/xocolatl/xocolatlUtils";
import AddressSelectableList from "~/components/micuenta/AddressSelectableList";

const appChainId = parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? "137");

const MiCuenta = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateWallet, setIsLoadingCreateWallet] = useState(false);
  const [isMounted] = useState(false);
  const [safes, setSafes] = useState<string[]>();
  const [activeSafe, setActiveSafe] = useState<string>();
  const [xocBalances, setXocBalances] = useState<BalanceMap>({});

  const { push } = useRouter();
  const toast = useToast();
  const { ready, authenticated, logout, createWallet, user } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { refetch: refetchWalletClient } = useWalletClient();

  const { data: userWalletsData } = api.wallets.getUserWallets.useQuery({
    ownerId: user?.id.replace("did:privy:", "") ?? "",
  });

  const { mutate: registerWallet, isLoading: isSubmitting } =
    api.wallets.createWallet.useMutation({
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Cartera registrada exitosamente",
          description: "Puedes empezar a utilizar tu cartera",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        console.log(error);
        const errorMsg =
          error.message ??
          "No fue posible registrar la cartera, intenta de nuevo";
        toast({
          title: "Ocurrió un error...",
          description: errorMsg,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      },
    });

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
      setActiveSafe(safes[0])
    };

    if (!isMounted) {
      void buildListOfUserSafes();
    }
  }, [activeWallet, isMounted, safes]);

  useEffect(() => {
    const getXocBalances = async () => {
      if (!activeWallet || !safes || safes.length === 0) return;
      const ethersSigner = await privyWagmiWalletToSigner(
        activeWallet,
        appChainId
      );
      const balances: BalanceMap = {};
      for (const safe of safes) {
        console.log("safe", safes);
        const bal = await readXocBalance(safe, ethersSigner.provider);
        console.log("bal del safe", bal);
        if (bal != null) {
          balances[safe] = bal;
        }
      }
      setXocBalances(balances);
    };

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
    if (!safes || safes.length === 0) throw "This wallet owns no Safe";
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
  };

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

  const handleRegisterWallet = () => {
    setIsLoading(true);
    if (!user || !embeddedWallets?.[0]?.address) return;
    const data = {
      ownerId: user?.id.replace("did:privy:", "") ?? "",
      address: embeddedWallets[0]?.address,
      type: "PRIVY" as "PRIVY" | "SAFE" | "EOA",
    };
    registerWallet(data);
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
          <Heading as="h1" fontSize={["6xl"]}>
            {'Dashboard'}
          </Heading>
          {authenticated ? (
            <AddressSelectableList
              locale={
                {
                  listTitleLocale: "my_keys",
                  active_key: "active_key",
                  available_keys: "available_keys",
                  warn_no_keys: "warn_no_keys",
                  active_state: "active_state",
                  activate_button: "activate_button"
                }
              }
              activeAddress={activeWallet ? activeWallet.address : wallets[0]?.address as string}
              activeAddressLink="https://polygonscan.com/address/"
              addressList={wallets.map(w => w.address)}
            />
          ) : (
            <LoaderPage text={t("loader_msg_redirecting")} />
          )}
          {
            safes ? (
              <AddressSelectableList
                locale={
                  {
                    listTitleLocale: "my_safe_accounts",
                    active_key: "active_safe",
                    available_keys: "available_safes",
                    warn_no_keys: "warn_no_safes",
                    active_state: "active_state",
                    activate_button: "activate_button"
                  }
                }
                activeAddress={activeSafe as string}
                activeAddressLink="https://polygonscan.com/address/"
                addressList={safes}

              />

            ) : (
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
            )
          }
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
        </Flex>
      </Flex >
    </PageWithAppBar >
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

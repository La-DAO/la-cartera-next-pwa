import React, { useCallback, useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useBalance } from "wagmi";
import { isAddress } from "viem";

import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon, DownloadIcon } from "@chakra-ui/icons";

import { PageWithAppBar } from "~/components/layout/AppBar";
import LoaderPage from "~/components/loader/LoaderPage";
import { truncateAddress } from "~/utils/string";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useWalletClient } from "wagmi";
import SendModalButton from "~/components/cartera/SendModal";
import { privyWagmiWalletToSigner } from "../contracts/wagmiAdapters";
import {
  type BalanceMap,
  readXocBalance,
  sendGaslessXoc,
} from "~/contracts/xocolatl/xocolatlUtils";
import {
  createUserPaidNewSafeAccount,
  getUserAssociatedSafeAccounts,
} from "../contracts/safeAccount/safeAccountUtils";

const appChainId = parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? "137");

const Cartera = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateWallet, setIsLoadingCreateWallet] = useState(false);
  const [safes, setSafes] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSafeLoaded, setIsSafeLoaded] = useState(false);
  const { push } = useRouter();

  const { ready, authenticated, logout, createWallet, user } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { refetch: refetchWalletClient } = useWalletClient();
  const [xocBalance, setXocBalance] = useState<BalanceMap>({});

  const embeddedWallets = wallets.filter(
    (wallet) =>
      wallet.connectorType === "embedded" && wallet.walletClientType === "privy"
  );

  const {
    data: balance,
    isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: activeWallet?.address as `0x${string}`,
  });

  const toast = useToast();

  const handleGaslessSendXoc = async (
    selectedFromAddress: string,
    sendToAddress: string,
    amount: string
  ) => {
    if (!safes || safes.length === 0) throw "This wallet owns no Safe";
    // const userReceiverInput = prompt("Please enter an address:")!;
    // if (!isAddress(userReceiverInput)) throw "Enter valid address";
    // const amountInput = prompt("Please amount to send:")!;

    console.log("happy", sendToAddress, amount);

    try {
      await refetchWalletClient();
      if (!activeWallet) return;
      const ethersSigner = await privyWagmiWalletToSigner(
        activeWallet,
        appChainId
      );
      await sendGaslessXoc(
        ethersSigner,
        selectedFromAddress,
        sendToAddress,
        amount
      );
      toast({
        title: "Transacción enviada",
        description: "Datos de la transferencia",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const buildListOfUserSafes = async () => {
  //     if (!activeWallet) return;
  //     const ethersSigner = await privyWagmiWalletToSigner(
  //       activeWallet,
  //       appChainId
  //     );
  //     const safes = await getUserAssociatedSafeAccounts(ethersSigner);
  //     setSafes(safes);
  //   };

  //   const getXocBalances = async () => {
  //     if (!activeWallet || !safes || safes.length === 0) return;
  //     const ethersSigner = await privyWagmiWalletToSigner(
  //       activeWallet,
  //       appChainId
  //     );
  //     const balances: BalanceMap = {};
  //     for (const safe of safes) {
  //       console.log("safe", safes);
  //       const bal = await readXocBalance(safe, ethersSigner.provider);
  //       console.log("bal del safe", bal);
  //       if (bal != null) {
  //         balances[safe] = bal;
  //       }
  //     }
  //     setXocBalance(balances);
  //   };

  //   if (!isMounted) {
  //     void buildListOfUserSafes();
  //     void getXocBalances();
  //   }
  // }, [activeWallet, isMounted, safes]);

  const buildListOfUserSafes = useCallback(async () => {
    if (!activeWallet) return;
    const ethersSigner = await privyWagmiWalletToSigner(
      activeWallet,
      appChainId
    );
    const safes = await getUserAssociatedSafeAccounts(ethersSigner);
    setSafes(safes);
    console.log(safes);

    const balances: BalanceMap = {};
    for (const safe of safes) {
      // console.log("safe", safes);
      const bal = await readXocBalance(safe, ethersSigner.provider);
      // console.log("bal del safe", bal);
      if (bal != null) {
        balances[safe] = bal;
      }
    }
    console.log(balances);
    setXocBalance(balances);
    setIsSafeLoaded(true);
  }, [activeWallet]);

  // const getXocBalances = useCallback(async () => {
  //   if (!activeWallet || !safes || safes.length === 0) return;
  //   const ethersSigner = await privyWagmiWalletToSigner(
  //     activeWallet,
  //     appChainId
  //   );
  //   const balances: BalanceMap = {};
  //   for (const safe of safes) {
  //     // console.log("safe", safes);
  //     const bal = await readXocBalance(safe, ethersSigner.provider);
  //     // console.log("bal del safe", bal);
  //     if (bal != null) {
  //       balances[safe] = bal;
  //     }
  //   }
  //   console.log(balances);
  //   setXocBalance(balances);
  // }, [activeWallet, safes]);

  useEffect(() => {
    if (ready && !authenticated) {
      void push("/ingresar");
    }
    if (ready) {
      void activeWallet?.switchChain(appChainId);
      void refetchWalletClient();
      if (!isSafeLoaded) {
        void buildListOfUserSafes();
      }
      // if (isSafeLoaded) {
      //   void getXocBalances();
      // }
    }

    // if (ready && !isMounted) {
    //   void buildListOfUserSafes();
    //   void getXocBalances();
    //   setIsMounted(true);
    // }
  }, [
    activeWallet,
    authenticated,
    buildListOfUserSafes,
    isMounted,
    isSafeLoaded,
    push,
    ready,
    refetchWalletClient,
    safes,
  ]);

  // useEffect(() => {
  //   console.log(safes);
  //   if (safes.length > 0) {
  //     setIsMounted(true);
  //   }
  // }, [safes]);

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
              <Flex flexDirection="column" alignItems="center" gap={2}>
                <Flex gap={2} alignItems="center">
                  <Heading
                    as="span"
                    fontSize={["7xl"]}
                    fontWeight="medium"
                    color="ldWhiteBeige"
                  >
                    {Number.parseFloat(balance?.formatted ?? "0").toFixed(2)}
                  </Heading>
                  <Heading
                    as="span"
                    fontSize={["4xl"]}
                    mt={4}
                    color="ldWhiteBeige"
                  >
                    {balance?.symbol}
                  </Heading>
                </Flex>
                <Box>
                  <ButtonGroup gap="4">
                    <IconButton
                      aria-label="External link"
                      isRound={true}
                      variant="primary"
                      size="lg"
                      icon={
                        <Icon
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                          h={6}
                          w={6}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </Icon>
                      }
                    />
                    <IconButton
                      aria-label="External link"
                      isRound={true}
                      variant="primary"
                      size="lg"
                      icon={<DownloadIcon h={6} w={6} />}
                    />
                    <SendModalButton
                      safes={safes}
                      xocBalance={xocBalance}
                      userAddress={activeWallet?.address ?? "0x00"}
                      handleGaslessSendXoc={handleGaslessSendXoc}
                    />
                  </ButtonGroup>
                </Box>
              </Flex>
              <Box px={4} textAlign="left" w="100%">
                <Heading as="h2" fontSize="2xl" mb={2}>
                  Cartera activa:
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
                      : "No tienes cartera activa"}
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
                      : "No tienes cartera activa"}
                  </Text>
                  {activeWallet && (
                    <Link
                      href={`https://mumbai.polygonscan.com/address/${activeWallet.address}`}
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
              </Box>
            </>
          ) : (
            <LoaderPage text="Redireccionando..." />
          )}
        </Flex>
      </Flex>
    </PageWithAppBar>
  );
};

export default Cartera;

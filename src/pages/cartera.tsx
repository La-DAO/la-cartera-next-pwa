import React, { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useBalance } from "wagmi";

import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon, DownloadIcon } from "@chakra-ui/icons";

import { PageWithAppBar } from "~/components/layout/AppBar";
import LoaderPage from "~/components/loader/LoaderPage";
import { truncateAddress } from "~/utils/string";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import SendModalButton from "~/components/cartera/SendModal";

const Cartera = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateWallet, setIsLoadingCreateWallet] = useState(false);
  const { push } = useRouter();
  const { ready, authenticated, logout, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  const {
    data: balance,
    isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: activeWallet?.address as `0x${string}`,
  });

  console.log(balance);
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
                    <SendModalButton />
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

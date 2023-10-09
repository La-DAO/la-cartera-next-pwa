import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useRouter } from "next/router";

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

const MiCuenta = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateWallet, setIsLoadingCreateWallet] = useState(false);
  const { push } = useRouter();
  const { ready, authenticated, logout, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  const embeddedWallets = wallets.filter(
    (wallet) =>
      wallet.connectorType === "embedded" && wallet.walletClientType === "privy"
  );

  const handleCreateWallet = async () => {
    setIsLoadingCreateWallet(true);
    try {
      await createWallet();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCreateWallet(false);
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
      await activeWallet.switchChain(80001);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      void push("/ingresar");
    }
  });

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
                Mi Cuenta
              </Heading>
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
                {activeWallet?.chainId !== "eip155:80001" && (
                  <Flex justifyContent="center" mt={4} w="100%">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleSwitchNetwork}
                    >
                      Cambiar red
                    </Button>
                  </Flex>
                )}
              </Box>
              <Box px={4} textAlign="left" w="100%">
                <Heading as="h2" fontSize="2xl" mb={4}>
                  Carteras conectadas
                </Heading>
                {wallets.length === 0 ? (
                  <Text fontSize="xl" ml={2}>
                    No tienes carteras disponibles
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
                                Active
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                w="100%"
                                onClick={() => void setActiveWallet(wallet)}
                              >
                                Activate
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
                      onClick={handleCreateWallet}
                      isDisabled={!(ready && authenticated)}
                      isLoading={isLoadingCreateWallet}
                      loadingText="Creando..."
                      spinnerPlacement="end"
                    >
                      Crear cartera
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
                  loadingText="Saliendo..."
                  spinnerPlacement="end"
                >
                  Cerrar Sesión
                </Button>
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

export default MiCuenta;

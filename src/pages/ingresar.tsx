import React from "react";
import { useRouter } from "next/router";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

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

const Login = () => {
  const { push } = useRouter();
  const { ready, authenticated, logout } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  const { login } = useLogin({
    onComplete: () => {
      void push("/micuenta");
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
              Inicia Sesión
            </Heading>
            <Button
              size={["lg", null, null, "md"]}
              variant="primary"
              onClick={login}
              px={[null, null, 6, 8]}
            >
              Ingresar
            </Button>
          </>
        ) : (
          <>
            <Heading as="h1" fontSize={["4xl"]}>
              Mi Cuenta
            </Heading>
            <Box px={4} textAlign="left" w="100%">
              <Heading as="h2" fontSize="2xl" mb={2}>
                Cartera activa:
              </Heading>
              <Text fontSize="xl" fontWeight="medium" ml={2}>
                {truncateAddress(activeWallet?.address, 12, 10)}
              </Text>
            </Box>
            <Box px={4} textAlign="left" w="100%">
              <Heading as="h2" fontSize="2xl" mb={4}>
                Carteras conectadas
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
            </Box>
            <Box py={8}>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => void logout()}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </PageWithAppBar>
  );
};

export default Login;

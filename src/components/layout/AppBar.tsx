import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { Link } from "@chakra-ui/next-js";

import { useTranslation } from "next-i18next";

import { BellIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Image,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import LanguageSwitcher from "../LanguageSwitcher";

export const APPBAR_HEIGHT_PX = 56;
export const NAVBAR_HEIGHT_PX = 72;

export interface AppBarProps {
  title?: string;
  navTitle?: string;
}

type MenuDrawerProps = {
  authenticated: boolean;
  isLoading: boolean;
  onSignoutHandler: () => void;
};

const MenuDrawer = ({
  authenticated,
  isLoading,
  onSignoutHandler,
}: MenuDrawerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("common");

  return (
    <>
      <IconButton
        onClick={onOpen}
        ref={btnRef}
        variant="unstyled"
        aria-label="Menús"
        icon={
          <HamburgerIcon
            color="ldWhiteBeige"
            h={[8, null, 7]}
            w={[8, null, 7]}
            _hover={{
              color: "primary",
            }}
          />
        }
        size="md"
      />
      <Drawer
        size={["full", null, "xs", null, "sm"]}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          bgColor="ldBlackJet.900"
          maxH="100svh"
          pt={[8, null, 6]}
          pb={16}
        >
          <DrawerCloseButton
            size="lg"
            color="ldWhiteBeige"
            _hover={{ background: "transparent", color: "primary" }}
          />
          <DrawerHeader color="primary" fontSize={["2xl"]}>
            {t('menudrawer_menu')}
          </DrawerHeader>
          <DrawerBody px={12}>
            <List spacing={4} fontSize={["xl"]}>
              {authenticated ? (
                <>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="#"
                      display="flex"
                      w="full"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      <Icon
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        h={5}
                        w={5}
                      >
                        <path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-6 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM19 15H9v-.25C9 12.901 11.254 11 14 11s5 1.901 5 3.75V15z" />
                        <path d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8z" />
                      </Icon>
                      {t('menudrawer_keys')}
                    </Link>
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="#"
                      display="flex"
                      w="full"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      <SettingsIcon boxSize={5} />
                      {t('menudrawer_settings')}
                    </Link>
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="#"
                      display="flex"
                      w="full"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      <BellIcon boxSize={5} />
                      {t('menudrawer_notifications')}
                    </Link>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="/"
                      display="flex"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      {t('menudrawer_home')}
                    </Link>
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="#"
                      display="flex"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      {t('menudrawer_documentation')}
                    </Link>
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="#"
                      display="flex"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      {t('menudrawer_community')}
                    </Link>
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <Link
                      href="#"
                      display="flex"
                      alignItems="center"
                      gap={4}
                      onClick={onClose}
                    >
                      {t('menudrawer_aboutus')}
                    </Link>
                  </ListItem>
                </>
              )}
            </List>
            {!authenticated && (
              <Flex px={12} mt={8}>
                <Link
                  href="/ingresar"
                  display="flex"
                  w="full"
                  alignItems="center"
                  gap={4}
                  onClick={onClose}
                >
                  <Button variant="primary" size={["lg", null, "md"]} w="full">
                    {t('login_button')}
                  </Button>
                </Link>
              </Flex>
            )}
          </DrawerBody>
          {authenticated && (
            <DrawerFooter px={12}>
              <Button
                variant="secondary"
                size={["lg", null, "md"]}
                w="full"
                onClick={() => {
                  onSignoutHandler();
                  onClose();
                }}
                isLoading={isLoading}
                loadingText="Saliendo..."
                spinnerPlacement="end"
              >
                {t('logout_button')}
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const AppBar: React.FC<AppBarProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const { authenticated, logout } = usePrivy();

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

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      width="100vw"
      height={`${APPBAR_HEIGHT_PX}px`}
      p={[4, null, null, 8]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
      >
        <Link as="div" display="flex" gap={2} alignItems="center" href="/">
          <Image
            src="/logos/la-cartera-cacao.png"
            alt="LaCartera logo: una fruta del cacao partida a la mitad"
            h={7}
            w={7}
          />
          <Text fontSize="2xl" fontWeight="bold">
            LaCartera
          </Text>
        </Link>
        <Flex alignItems="center" gap={4}>
          <LanguageSwitcher />
          <MenuDrawer
            authenticated={authenticated}
            isLoading={isLoading}
            onSignoutHandler={handleLogout}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export function BottomNavbar() {
  return (
    <Box
      className="bottom-nav"
      display="flex"
      justifyContent="center"
      position="fixed"
      bottom={0}
      height={`${NAVBAR_HEIGHT_PX}px`}
      width="100vw"
    >
      <Flex
        mb={3}
        w={["90%", null, "50%", "30%"]}
        justifyContent="center"
        alignItems="center"
        gap={8}
      >
        {/*
            // TODO: Add links
        */}
        <Link variant="unstyled" href="#">
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              isRound={true}
              variant="outline"
              colorScheme="whiteAlpha"
              _hover={{
                backgroundColor: "#4e2118",
              }}
              aria-label="Notificaciones"
              icon={
                <svg
                  fill="none"
                  stroke="#f6f2e6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  height="1.2rem"
                  width="1.2rem"
                >
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              }
            />
          </Box>
        </Link>
        <Link variant="unstyled" href="/">
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              isRound={true}
              bgColor="primary"
              _hover={{
                backgroundColor: "#913725",
              }}
              aria-label="Cartera"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  height={28}
                  width={28}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
              }
            />
          </Box>
        </Link>
        <Link variant="unstyled" href="#">
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              isRound={true}
              variant="outline"
              colorScheme="whiteAlpha"
              _hover={{
                backgroundColor: "#4e2118",
              }}
              aria-label="Mensajes"
              icon={
                <svg
                  fill="none"
                  stroke="#f6f2e6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  height="1.2rem"
                  width="1.2rem"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              }
            />
          </Box>
        </Link>
      </Flex>
    </Box>
  );
}

export const PageWithAppBar: React.FC<
  AppBarProps & { children: React.ReactNode }
> = (props) => {
  const { authenticated } = usePrivy();

  return (
    <>
      <AppBar {...props} />
      <Box
        as="main"
        position="absolute"
        top={`${APPBAR_HEIGHT_PX}px`}
        sx={{
          height: `calc(100svh - ${APPBAR_HEIGHT_PX}px - ${NAVBAR_HEIGHT_PX}px)`,
          width: "100vw",
          overflow: "scroll",
        }}
      >
        {props.children}
      </Box>
      {authenticated && <BottomNavbar />}
    </>
  );
};

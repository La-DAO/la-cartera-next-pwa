import React from "react";

import { Link } from "@chakra-ui/next-js";
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

export const APPBAR_HEIGHT_PX = 56;
export const NAVBAR_HEIGHT_PX = 64;

export interface AppBarProps {
  title?: string;
  navTitle?: string;
}

const MenuDrawer = ({ onSignoutHandler }: { onSignoutHandler: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        onClick={onOpen}
        ref={btnRef}
        variant="unstyled"
        aria-label="Menú"
        icon={
          <HamburgerIcon
            color="ldWhiteBeige"
            h={[8, null, 7]}
            w={[8, null, 7]}
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
        <DrawerContent bgColor="ldBlackJet.500" pt={[8, null, 6]} pb={16}>
          <DrawerCloseButton size="lg" color="ldWhiteBeige" />
          <DrawerHeader fontSize={["2xl"]}>Menú</DrawerHeader>
          <DrawerBody px={12}>
            <List spacing={4} fontSize={["lg"]}>
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
                    <path
                      fill-rule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clip-rule="evenodd"
                    />
                  </Icon>
                  Perfil
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
                  Configuración
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
                  Notificaciones
                </Link>
              </ListItem>
            </List>
          </DrawerBody>
          <DrawerFooter px={12}>
            <Button
              variant="secondary"
              w="full"
              onClick={() => {
                onSignoutHandler();
                onClose();
              }}
            >
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const AppBar: React.FC<AppBarProps> = (props) => {
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
        <Flex alignItems="center" gap={2}>
          <Image
            src="/logos/la-cartera-cacao.png"
            alt="LaCartera logo: una fruta del cacao partida a la mitad"
            h={7}
            w={7}
          />
          <Text fontSize="2xl" fontWeight="bold">
            LaCartera
          </Text>
        </Flex>
        <MenuDrawer
          onSignoutHandler={() => console.log("onSignoutHandler called")}
        />
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
      bgColor="whiteAlpha.900"
      color="blackAlpha.900"
    >
      <Flex
        mb={2}
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
              variant="solid"
              colorScheme="orange"
              bgColor="primary"
              aria-label="Cartera"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
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
      <BottomNavbar />
    </>
  );
};

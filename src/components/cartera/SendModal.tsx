import { type FormEvent, useState } from "react";

import {
  useDisclosure,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Radio,
  RadioGroup,
  Text,
  Stack,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { truncateAddress } from "~/utils/string";
import { Link } from "@chakra-ui/next-js";

const placeholderContacts = [
  {
    address: "0x5e25c391810eE5Bc705c87FB51c368612982D57a",
    ens: "xocolatl.eth",
  },
  { address: "0x0331236dbB265980E7Cc425D46FfD6a3f1Ef501A", ens: "frutero.eth" },
  { address: "0x8badd8b59DdAf9A12c4910Ca1B2E8ea750A71594", ens: undefined },
  { address: "0xeD58c1085D218b14d1ccD37B498E0049d84bf1cC", ens: undefined },
  {
    address: "0xF54f4815f62ccC360963329789d62d3497A121Ae",
    ens: "innvertir.eth",
  },
];
const placeholderRecent = [
  { address: "0x6479A50361D6e7f9c0589d5Afc22688455c50875", ens: undefined },
  { address: "0x91BdF24eBB479Ca430bbB85c3f67145E0ebD087a", ens: "antisat.eth" },
  { address: "0xF37e7812A5Fbf4830b6Ff0737A84f49FfEC5a9EC", ens: undefined },
];

const SendModalButton = () => {
  const [sendToAddress, setSendToAddress] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSelectedAccount(null);
    setSendToAddress(value);
  };

  const handleRadioInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    console.log(value);
    setSelectedAccount(value);
    setSendToAddress(value);
  };

  return (
    <>
      <IconButton
        aria-label="External link"
        isRound={true}
        onClick={onOpen}
        variant="primary"
        size="lg"
        icon={<ArrowRightIcon ml={0.5} h={5} w={5} />}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={["full", null, "lg"]}>
        <ModalOverlay />
        <ModalContent px={[2, null, 4]}>
          <ModalHeader pb={0} pt={8}>
            <Heading as="h1" fontSize={["2.5rem", null, "3xl"]}>
              Enviar
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              display="flex"
              flexDirection="column"
              gap={[8, null, 6, 4]}
              pt={[8, null, null, 0]}
              pb={[2, null, 8]}
              px={[0, null, 8]}
            >
              <FormControl>
                <FormLabel
                  fontSize={["2xl", null, null, "xl"]}
                  fontWeight="medium"
                >
                  ¿A qué cuenta envias?
                </FormLabel>
                <Flex alignItems="center" gap={4}>
                  <Input
                    type="text"
                    size="lg"
                    value={selectedAccount ?? sendToAddress ?? ""}
                    onChange={handleOnChange}
                  />
                  <IconButton
                    variant="primary"
                    aria-label="Seleccionar cuenta"
                    icon={<ArrowRightIcon />}
                  />
                </Flex>
              </FormControl>
              <Flex display="flex" flexDirection="column" gap={4}>
                <Flex display="flex" flexDirection="column" gap={2}>
                  <Heading as="h3" fontSize={["2xl", null, null, "xl"]}>
                    Contactos
                  </Heading>
                  <RadioGroup colorScheme="red">
                    <Stack direction="column" gap={5} px={4}>
                      {placeholderContacts.map((contact) => (
                        <Radio
                          _checked={{
                            background: `${
                              selectedAccount &&
                              selectedAccount === contact.address
                                ? "ldBlackOrange"
                                : "transparent"
                            }`,
                            borderColor: `${
                              selectedAccount &&
                              selectedAccount === contact.address
                                ? "primary"
                                : "white"
                            }`,
                          }}
                          key={contact.address}
                          value={contact.address}
                          onChange={(event) => handleRadioInputChange(event)}
                        >
                          <Text fontSize="lg" ml={2}>
                            {contact.ens ??
                              truncateAddress(contact.address, 10, 8)}
                          </Text>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                  <Link
                    href="#"
                    variant="unstyled"
                    fontSize="lg"
                    textAlign="right"
                    px={8}
                    mt={[4, null, 2]}
                  >
                    Mi Directorio
                  </Link>
                </Flex>
                <Flex display="flex" flexDirection="column" gap={2}>
                  <Heading as="h3" fontSize={["2xl", null, null, "xl"]}>
                    Recientes
                  </Heading>
                  <RadioGroup
                    colorScheme="red"
                    onChange={setSelectedAccount}
                    value={selectedAccount ?? undefined}
                  >
                    <Stack direction="column" gap={5} px={4}>
                      {placeholderRecent.map((contact) => (
                        <Radio
                          _checked={{
                            background: `${
                              selectedAccount &&
                              selectedAccount === contact.address
                                ? "ldBlackOrange"
                                : "transparent"
                            }`,
                            borderColor: `${
                              selectedAccount &&
                              selectedAccount === contact.address
                                ? "primary"
                                : "white"
                            }`,
                          }}
                          key={contact.address}
                          value={contact.address}
                          onChange={(event) => handleRadioInputChange(event)}
                        >
                          <Text fontSize="lg" ml={2}>
                            {contact.ens ??
                              truncateAddress(contact.address, 10, 8)}
                          </Text>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                  <Link
                    href="#"
                    variant="unstyled"
                    fontSize="lg"
                    textAlign="right"
                    px={8}
                    mt={[4, null, 2]}
                  >
                    Más envíos recientes
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendModalButton;

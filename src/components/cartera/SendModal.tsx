import { type FormEvent, useState } from "react";

import {
  useDisclosure,
  Button,
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
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  useToast,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { truncateAddress } from "~/utils/string";
import { Link } from "@chakra-ui/next-js";

import { api } from "~/utils/api";
import { useBalance } from "wagmi";

const appChainId = parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? "137");

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

type SendModalProps = {
  userAddress: string;
};

const SendModalButton = ({ userAddress }: SendModalProps) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [amount, setAmount] = useState("0");
  const [sendToAddress, setSendToAddress] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    data: balance,
    isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: userAddress as `0x${string}`,
  });

  const { mutate: registerNativeTokenTx, isLoading: isLoadingSendNativeToken } =
    api.transactions.createTransaction.useMutation({
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Tu transacción ha sido enviada",
          description: "Espera la confirmación",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        console.log(error);
        const errorMsg =
          error.message ??
          "No fue posible enviar la transacción, intenta de nuevo";
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

  const { mutate: registerERC20tx, isLoading: isLoadingSendERC20Token } =
    api.erc20transactions.createErc20TokenTransaction.useMutation({
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Tu transacción ha sido enviada",
          description: "Espera la confirmación",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        console.log(error);
        const errorMsg =
          error.message ??
          "No fue posible enviar la transacción, intenta de nuevo";
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

  const handleOnChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    console.log(name, value);
    switch (name) {
      case "sendToAddress":
        setSelectedAccount(null);
        setSendToAddress(value);
        break;
      case "amount":
        setAmount(value);
        break;
      case "description":
        setDescription(value);
        break;
    }
  };

  const handleRadioInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    console.log(value);
    setSelectedAccount(value);
    setSendToAddress(value);
  };

  const handleSend = () => {
    console.log(amount, sendToAddress);
    if (!sendToAddress || !amount) {
      toast({
        title: "Información incompleta",
        description: "Introduce cuenta de quién recibe y cantidad.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log(parseFloat(amount), userAddress, sendToAddress);
    registerNativeTokenTx({
      chainId: 137,
      amount: parseFloat(amount),
      senderId: userAddress,
      receiverAddress: sendToAddress,
    });
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={["full", null, "lg", "xl"]}
      >
        <ModalOverlay />
        <ModalContent px={[2, null, 4]}>
          <ModalHeader pb={0} pt={8}>
            <Heading as="h1" fontSize={["2.5rem", null, "3xl"]}>
              Enviar
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted colorScheme="orange" index={step}>
              <TabList mb="1em">
                <Tab onClick={() => setStep(0)}>Recibe</Tab>
                <Tab onClick={() => setStep(1)}>Detalles</Tab>
                <Tab onClick={() => setStep(2)}>Confirmar</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
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
                          name="sendToAddress"
                          type="text"
                          size="lg"
                          value={selectedAccount ?? sendToAddress ?? ""}
                          onChange={handleOnChange}
                        />
                        <IconButton
                          variant="primary"
                          aria-label="Seleccionar cuenta"
                          icon={<ArrowRightIcon />}
                          onClick={() => setStep(1)}
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
                                onChange={(event) =>
                                  handleRadioInputChange(event)
                                }
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
                                onChange={(event) =>
                                  handleRadioInputChange(event)
                                }
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
                </TabPanel>
                <TabPanel>
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
                        Cantidad a enviar
                      </FormLabel>
                      <Flex alignItems="center" gap={4}>
                        <Input
                          name="amount"
                          type="text"
                          textAlign="center"
                          size="lg"
                          value={amount ?? "0"}
                          onChange={handleOnChange}
                        />
                      </Flex>
                      {balance && (
                        <FormHelperText textAlign="center">
                          Disponible: {balance.formatted ?? "0"}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        fontSize={["2xl", null, null, "xl"]}
                        fontWeight="medium"
                      >
                        Concepto
                      </FormLabel>
                      <Textarea
                        name="description"
                        placeholder="Opcional..."
                        onChange={handleOnChange}
                      />
                    </FormControl>
                    <Flex display="flex" justifyContent="center" gap={4} mt={8}>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setStep(2)}
                        w={"50%"}
                      >
                        Revisar
                      </Button>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel>
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
                        Recibe
                      </FormLabel>
                      <Flex alignItems="center" gap={4}>
                        <Input
                          name="sendToAddress"
                          type="text"
                          size="lg"
                          value={selectedAccount ?? sendToAddress ?? ""}
                          disabled
                        />
                      </Flex>
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        fontSize={["2xl", null, null, "xl"]}
                        fontWeight="medium"
                      >
                        Cantidad a enviar
                      </FormLabel>
                      <Flex alignItems="center" gap={4}>
                        <Input
                          type="text"
                          textAlign="center"
                          size="lg"
                          value={amount ?? "0"}
                          disabled
                        />
                      </Flex>
                      {balance && (
                        <FormHelperText textAlign="center">
                          Disponible: {balance.formatted ?? "0"}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        fontSize={["2xl", null, null, "xl"]}
                        fontWeight="medium"
                      >
                        Concepto
                      </FormLabel>
                      <Textarea value={description} disabled />
                    </FormControl>
                    <Flex display="flex" justifyContent="center" gap={4} mt={8}>
                      <Button
                        variant="primary"
                        size="lg"
                        w={"50%"}
                        onClick={() => handleSend()}
                      >
                        Enviar
                      </Button>
                    </Flex>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendModalButton;

import { useEffect, useState } from "react";
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
import { Link } from "@chakra-ui/next-js";
import { useTranslation } from "react-i18next";
import AddressLineFormatter from "./AddressLineFormatter";
import { truncateAddress } from "~/utils/string";


type SelectableListProps = {
  locale: {
    listTitleLocale: string;
    active_key: string;
    available_keys: string;
    warn_no_keys: string;
    active_state: string;
    activate_button: string;
  }
  activeAddress: string;
  activeAddressLink: string;
  addressList: string[];
};

export default function AddressSelectableList(props: SelectableListProps) {
  const {
    locale,
    activeAddress,
    activeAddressLink,
    addressList
  } = props;
  const { t } = useTranslation('common');
  const [_activeAddress, setActiveAddress] = useState<string>();

  useEffect(() => {
    if (!_activeAddress && activeAddress) {
      setActiveAddress(activeAddress)
    }
  }, [_activeAddress, addressList]);

  return (
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
          <Heading as="h1" fontSize={["4xl"]}>
            {t(locale.listTitleLocale)}
          </Heading>
          <Box px={4} textAlign="left" w="100%">
            <Heading as="h2" fontSize="2xl" mb={2}>
              {t(locale.active_key)}:
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
                {_activeAddress
                  ? truncateAddress(_activeAddress, 12, 10)
                  : t(locale.warn_no_keys)}
              </Text>
              <Text
                    display={["none", null, null, null, "block"]}
                    fontSize="xl"
                    fontWeight="medium"
                    ml={2}
                    gap={4}
                  >
                    {_activeAddress
                      ? _activeAddress
                      : t(locale.warn_no_keys)}
                  </Text>
              <Link
                href={`${activeAddressLink}${_activeAddress}`}
                target="_blank"
              >
                <IconButton
                  aria-label="External link"
                  variant="unstyled"
                  icon={<ExternalLinkIcon h={5} w={5} mb={1} />}
                />
              </Link>
            </Flex>
          </Box>
          <Box px={4} textAlign="left" w="100%">
            <Heading as="h2" fontSize="2xl" mb={4}>
              {t(locale.available_keys)}
            </Heading>
            {addressList.length === 0 ? (
              <Text fontSize="xl" ml={2}>
                {t(locale.warn_no_keys)}
              </Text>
            ) : (
              <List>
                {addressList.map((addr) => (
                  <ListItem key={addr}>
                    <Grid templateColumns="repeat(3, 1fr)">
                      <GridItem
                        display="flex"
                        alignItems="center"
                        justifyContent="left"
                        colSpan={2}
                      >
                        {AddressLineFormatter({ address: addr })}
                      </GridItem>
                      <GridItem px={2}>
                        {addr === _activeAddress ? (
                          <Button
                            variant="outline"
                            isDisabled={true}
                            w="100%"
                          >
                            {t(locale.active_state)}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            w="100%"
                            onClick={() => void setActiveAddress(addr)}
                          >
                            {t(locale.activate_button)}
                          </Button>
                        )}
                      </GridItem>
                    </Grid>
                  </ListItem>
                ))}

              </List>
            )}
          </Box>
        </Flex>
      </Flex>
  );
}
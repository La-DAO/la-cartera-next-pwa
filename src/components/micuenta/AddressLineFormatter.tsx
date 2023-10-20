import {
  Flex,
  Text
} from "@chakra-ui/react";

import { truncateAddress } from "~/utils/string";

type AddressLineFormatterProps = {
  address: string;
}

export default function AddressLineFormatter(props:AddressLineFormatterProps) {
  const {address} = props;
  return (
    <span>
      <Text
        display={["block", null, null, null, "none"]}
        fontSize="xl"
        fontWeight="medium"
        ml={2}
      >
        {truncateAddress(address, 6, 6)}
      </Text>
      <Text
        display={["none", null, null, null, "block"]}
        fontSize="xl"
        fontWeight="medium"
        ml={2}
      >
        {truncateAddress(address, 14, 12)}
      </Text>
    </span>
  )
}
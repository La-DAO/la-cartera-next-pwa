import { Flex, Spinner, Text } from "@chakra-ui/react";

const LoaderPage = ({ text = "Cargando..." }: { text?: string }) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      h="100%"
      w="100%"
      pt={[32, null, null, 40]}
      pb={8}
      px={4}
      gap={[4, null, null, 2]}
    >
      <Spinner
        size={["2xl", null, "xl"]}
        thickness="0.35rem"
        speed="0.65s"
        emptyColor="ldBlackJet.500"
        color="ldOrange.500"
      />
      <Text fontSize="2xl" fontWeight="medium">
        {text}
      </Text>
    </Flex>
  );
};

export default LoaderPage;

import { PageWithAppBar } from "~/components/layout/AppBar";
import { Box, Button, Flex, Heading, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <PageWithAppBar>
        <Flex
          flexDirection="column"
          justifyContent="start"
          alignItems="center"
          h="100%"
          w="100%"
          pt={[32]}
          pb={8}
          px={4}
        >
          <VStack gap={[8, null, 12, 4]}>
            <Heading
              as="h1"
              size={["3xl", null, "4xl"]}
              color="primary"
              fontWeight="bold"
            >
              LaCartera
            </Heading>
            <Heading
              as="h3"
              size={["lg", null, "2xl"]}
              textAlign="center"
              fontWeight="medium"
            >
              Tus primeros pasos en Web3 <br />
              con la Comunidad
            </Heading>
          </VStack>
          <Box py={16}>
            <Button px={8} py={6} variant="secondary" fontSize="xl">
              🚧 En desarrollo: ETHOnline 2023 🏗️
            </Button>
          </Box>
        </Flex>
      </PageWithAppBar>
    </>
  );
}

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, withTranslation } from "next-i18next";

import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

import nextI18nConfig from "../../next-i18next.config.mjs";
import { PageWithAppBar } from "~/components/layout/AppBar";

function Home() {
  const { t } = useTranslation("common");
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
              {t("app_title")}
            </Heading>
            <Heading
              as="h3"
              size={["lg", null, "2xl"]}
              textAlign="center"
              fontWeight="medium"
            >
              {t("app_welcome")}
            </Heading>
          </VStack>
          <Flex justifyContent="center" py={16}>
            <Link href="/ingresar">
              <Button px={8} py={4} variant="primary" fontSize="xl" size="lg">
                {t("login_button")}
              </Button>
            </Link>
          </Flex>
          <Flex justifyContent="center">
            <Button
              px={8}
              py={4}
              variant="secondary"
              fontSize="xl"
              style={{ height: "unset", whiteSpace: "initial" }}
            >
              <Text noOfLines={2}>
                🚧 En construcción 🏗️
                <br /> ETHOnline 2023
              </Text>
            </Button>
          </Flex>
        </Flex>
      </PageWithAppBar>
    </>
  );
}

export default withTranslation("common")(Home);

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

import { Link } from "@chakra-ui/next-js";
import { Box, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { PageWithAppBar } from "~/components/layout/AppBar";
import { api } from "~/utils/api";

export default function Chains() {
  const toast = useToast();
  const { mutate: registerChain, isLoading: isSubmitting } =
    api.chains.createChain.useMutation({
      onSuccess: () => {
        toast({
          title: "Cadena registrada exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        console.log(error);
        const errorMsg =
          error.message ?? "No fue posible crear el usuario, intenta de nuevo";
        toast({
          title: "Ocurrió un error...",
          description: errorMsg,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });

  return (
    <PageWithAppBar>
      <Box textAlign="center" py={[32, null, 16, 24, 32]} px={16}>
        <Heading display="inline-block" as="h2" size="3xl" color="primary">
          Register new chain
        </Heading>
        <Button
          variant="primary"
          size="lg"
          onClick={() => registerChain({ id: 137, name: "Polygon Mainnet" })}
        >
          Register Polygon
        </Button>

        <Link href="/">
          <Button variant="primary" size="lg">
            Ir a Inicio
          </Button>
        </Link>
      </Box>
    </PageWithAppBar>
  );
}

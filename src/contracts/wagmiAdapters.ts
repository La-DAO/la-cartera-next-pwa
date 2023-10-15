/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type PublicClient, getPublicClient } from "@wagmi/core";
import { type WalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { type HttpTransport } from "viem";
import { useWalletClient } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  const transport_: string = transport.url as string;
  return new providers.JsonRpcProvider(transport_, network);
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = getPublicClient({ chainId });
  return publicClientToProvider(publicClient);
}

/**
 * Convert passed wagmi `walletClient` to `ethers.provider.JsonRpcSigner`
 * @param walletClient from wagmi
 * @returns An ethers.provider.JsonRpcSigner
 */
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/**
 * Convert injected viem `WalletClient` to an `ethers.provider.JsonRpcSigner`
 * @param param0 {ChainId}
 * @returns ethers.provider.JsonRpcSigner
 */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({
    chainId,
    onSuccess(data) {
      console.log("Success", data);
      console.log("wallet client?!", walletClient);
      if (!data) return;
      return walletClientToSigner(data);
    },
  });
  console.log(walletClient);
  if (!walletClient) return undefined;
  return walletClientToSigner(walletClient);
}

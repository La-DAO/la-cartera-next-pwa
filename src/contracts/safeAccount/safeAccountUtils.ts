/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ethers } from "ethers";
import {
  EthersAdapter,
  SafeFactory,
  type SafeAccountConfig,
} from "@safe-global/protocol-kit";
import Safe from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { type SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { SAFE_SERVICE_URLS } from "./safeServicesURLS";
import { walletClientToSigner } from "../wagmiAdapters";
import { type WalletClient } from "@wagmi/core";

/**
 * Initiating a transaction for a Safe
 * REFERENCES:
 * https://docs.safe.global/safe-core-aa-sdk/protocol-kit#making-a-transaction-from-a-safe
 */
export async function initiateSafeTx(
  walletClient: WalletClient,
  safeAddr: string,
  toDestination: string,
  valueIntegerAmount: string,
  contractCallData: string
) {
  const txCreator = walletClientToSigner(walletClient);
  const chainId = await getChainIdFromSigner(txCreator);
  if (!SAFE_SERVICE_URLS[chainId])
    throw `No defined Safe Service URL for chainId ${chainId}`;
  const txServiceUrl: string = SAFE_SERVICE_URLS[chainId]!.url;
  const ethAdapter = getSafeEthersAdapter(txCreator);
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapter });

  // Create Safe instance
  const safe = await Safe.create({
    ethAdapter,
    safeAddress: safeAddr,
  });

  const safeTransactionData: SafeTransactionDataPartial = {
    to: toDestination,
    data: contractCallData,
    value: ethers.utils.parseEther(valueIntegerAmount).toString(),
  };

  const safeTransaction = await safe.createTransaction({ safeTransactionData });
  const senderAddress = await txCreator.getAddress();
  const safeTxHash = await safe.getTransactionHash(safeTransaction);
  const signature = await safe.signTransactionHash(safeTxHash);

  // Propose transaction to the service
  await safeService.proposeTransaction({
    safeAddress: await safe.getAddress(),
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: signature.data,
  });
}

export function computeNewSafeAddress() {
  // TODO
}

export async function createSponsoredNewSafeAccount() {
  // TODO
}

/**
 * Utilizes the Safe SDK to deploy a new Safe with user or `deployer` 
 * being the signer and requiring it to pay the gas for the deployment.
 * @param deployer ethers.provider.JsonRpcSigner
 * @returns Address of the newly deployed Safe Account
 */
export async function createUserPaidNewSafeAccount(
  deployer: ethers.providers.JsonRpcSigner
): Promise<string> {
  const ethAdapter = getSafeEthersAdapter(deployer);
  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });

  const safeOwners: string[] = [await deployer.getAddress()];

  const safeAccountConfig: SafeAccountConfig = {
    owners: safeOwners,
    threshold: safeOwners.length,
    // ... (Optional params)
  };
  const newSafeAccount = await safeFactory.deploySafe({ safeAccountConfig });
  const safeAddress = await newSafeAccount.getAddress();
  return safeAddress;
}

function getSafeEthersAdapter(etherSigner: ethers.providers.JsonRpcSigner) {
  return new EthersAdapter({
    ethers,
    signerOrProvider: etherSigner,
  });
}

async function getChainIdFromSigner(
  signer: ethers.providers.JsonRpcSigner
): Promise<string> {
  const hexChainId: string = (await signer.provider.send(
    "eth_chainId",
    []
  )) as string;
  return parseInt(hexChainId).toString();
}

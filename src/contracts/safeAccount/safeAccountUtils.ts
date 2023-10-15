import { ethers } from 'ethers';
import { EthersAdapter, SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { SAFE_SERVICE_URLS } from './safeServicesURLS';
import { getEthersProvider, walletClientToSigner } from '../wagmiAdapters';
import { type WalletClient, getWalletClient } from '@wagmi/core'

/**
 * Creating a transaction for a Safe
 * REFERENCES:
 * https://docs.safe.global/safe-core-aa-sdk/protocol-kit#making-a-transaction-from-a-safe
 */
export async function createSafeTx(
  walletClient: WalletClient,
  toDestination: string,
  value: string,
  data: string
) {
  const txCreator = walletClientToSigner(walletClient);
  const chainId = await getChainIdFromSigner(txCreator);
  // TODO Handle warning from below: `Object is possibly undefined`
  const txServiceUrl = SAFE_SERVICE_URLS[chainId].url ?
    SAFE_SERVICE_URLS[chainId].url : '';
  const ethAdapter = getSafeEthersAdapter(txCreator);
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapter });

}

export function computeNewSafeAddress() {
  // TODO
}

export async function createSponsoredNewSafeAccount() {
  // TODO
}

export async function createUserPaidNewSafeAccount(
  walletClient: WalletClient,
  otherKeys?: string[]
): Promise<string> {
  const deployer = walletClientToSigner(walletClient);
  const ethAdapter = getSafeEthersAdapter(deployer);
  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });
  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      await deployer.getAddress(),
      // await owner2Signer.getAddress(),
    ],
    threshold: 2,
    // ... (Optional params)
  }
  const newSafeAccount = await safeFactory.deploySafe({ safeAccountConfig })
  const safeAddress = await newSafeAccount.getAddress();
  return safeAddress;
}

function getSafeEthersAdapter(etherSigner: ethers.providers.JsonRpcSigner) {
  return new EthersAdapter({
    ethers,
    signerOrProvider: etherSigner
  });
}

async function getChainIdFromSigner(
  signer: ethers.providers.JsonRpcSigner
): Promise<string> {
  return parseInt(await signer.provider.send('eth_chainId', [])).toString()
}
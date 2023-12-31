import xocolatlABI from "../abis/xocolatlABI.json";
import { ethers, type Transaction } from "ethers";
import { sendGaslessSafeTx } from "../safeAccount/safeAccountUtils";

export const XOC_ADDRESS = "0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf";

/******************
 * DATA TYPES
 *****************/

export type BalanceMap = Record<string, ethers.BigNumberish>

/******************
 * WRITE METHODS
 *****************/

export async function sendXoc(
  signer: ethers.providers.JsonRpcSigner,
  receiver: string,
  floatAmount: string
): Promise<Transaction | null> {
  const xocWriter = buildEthersContract(
    XOC_ADDRESS,
    JSON.stringify(xocolatlABI),
    signer
  );
  const txrp = await callContractMethod(
    xocWriter,
    'transfer',
    [
      receiver,
      ethers.utils.parseUnits(floatAmount, 18)
    ]
  ) as Transaction | null;
  if (txrp == null) {
    return null;
  } else {
    return txrp;
  }
}

export async function sendGaslessXoc(
  signer: ethers.providers.JsonRpcSigner,
  signerSafeAccountAddr: string,
  receiver: string,
  floatAmount: string
) {
  const data = buildSendXocData(receiver, floatAmount);
  console.log(data);
  await sendGaslessSafeTx(
    signer,
    signerSafeAccountAddr,
    XOC_ADDRESS,
    "0",
    data
  );
}

/******************
 * READ METHODS
 *****************/

/**
 * 
 * @param owner address to check xoc balance
 * @param provider ethers provider
 * @returns wei integer amount in string format
 */
export async function readXocBalance(
  ownerAddress: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<string | null> {
  const xocReader = buildEthersContract(XOC_ADDRESS, JSON.stringify(xocolatlABI), provider);
  const response = await callContractMethod(
    xocReader,
    'balanceOf',
    [ownerAddress]
  ) as ethers.BigNumberish | null;
  if (response == null) {
    return null
  } else {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return ethers.utils.formatUnits(response, 18);
  }
}


/******************
 * HELPERS
 *****************/

/**
 * 
 * @param receiver address who will receive amount
 * @param floatAmount string in decimal form: e.g. "1.25" ether, "250" xoc
 * @returns HexString data to include in a tx
 */
export function buildSendXocData(
  receiver: string,
  floatAmount: string
): string {
  const ifaceXoc = buildEthersInterface(JSON.stringify(xocolatlABI));
  return ifaceXoc.encodeFunctionData(
    "transfer",
    [
      receiver,
      ethers.utils.parseUnits(floatAmount, 18)
    ]
  );
}

function buildEthersInterface(
  abi: string
): ethers.utils.Interface {
  return new ethers.utils.Interface(abi);
}

function buildEthersContract(
  address: string,
  abi: string,
  signerOrprovider: ethers.providers.JsonRpcSigner | ethers.providers.JsonRpcProvider
): ethers.Contract {
  return new ethers.Contract(address, abi, signerOrprovider);
}

// function connectEthersContract(
//   signer: ethers.providers.JsonRpcSigner,
//   contract: ethers.Contract
// ): ethers.Contract {
//   return contract.connect(signer);
// }

async function callContractMethod(
  contract: ethers.Contract,
  methodName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[] = []
): Promise<ethers.BigNumberish | Transaction | null> {
  try {
    // Make the read call to the contract
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const result = await contract[methodName](...params) as ethers.BigNumberish | Transaction;
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error calling contract method ${methodName}: ${err.message}`);
    }
    return null;
  }
}


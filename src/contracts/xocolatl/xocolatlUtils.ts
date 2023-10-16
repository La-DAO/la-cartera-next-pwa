import xocolatlABI from "../abis/xocolatlABI.json";
import { ethers, type Transaction } from "ethers";

export const XOC_ADDRESS = "0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf";


/******************
 * WRITE METHODS
 *****************/

export async function sendXoc(
  signer: ethers.providers.JsonRpcProvider,
  receiver: string,
  intAmount: string
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
      ethers.utils.parseUnits(intAmount, 18)
    ]
  ) as Transaction | null;
  if (txrp == null) {
    return null;
  } else {
    return txrp;
  }
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
    return response.toString()
  }
}


/******************
 * HELPERS
 *****************/

/**
 * 
 * @param receiver address who will receive amount
 * @param intAmount string in decimal form: e.g. "1.25" ether, "250" xoc
 * @returns HexString data to include in a tx
 */
export function buildSendXocData(
  receiver: string,
  intAmount: string
): string {
  const ifaceXoc = buildEthersInterface(JSON.stringify(xocolatlABI));
  return ifaceXoc.encodeFunctionData(
    "transfer",
    [
      receiver,
      ethers.utils.parseUnits(intAmount, 18)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
  try {
    // Make the read call to the contract
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await contract[methodName](...params) as any;
    // eslink-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  } catch (error) {
    console.error(`Error calling contract method ${methodName}: ${error}`);
    // You can handle the error here, throw it, or return an error object if needed.
    return null;
  }
}
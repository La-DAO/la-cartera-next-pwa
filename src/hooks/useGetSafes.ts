import { useEffect, useState } from "react";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { privyWagmiWalletToSigner } from "../contracts/wagmiAdapters";
import {
  getUserAssociatedSafeAccounts
} from "../contracts/safeAccount/safeAccountUtils";

const appChainId = parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? "137");

export const useGetSafes = () => {
  const [safes, setSafes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!activeWallet) return;
        const ethersSigner = await privyWagmiWalletToSigner(activeWallet, appChainId);
        const result: string[] = await getUserAssociatedSafeAccounts(ethersSigner);
        setSafes(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { safes, loading, error };
}
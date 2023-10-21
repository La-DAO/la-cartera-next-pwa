import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { walletRouter } from "./routers/wallet";
import { transactionRouter } from "./routers/transaction";
import { erc20TokenRouter } from "./routers/erc20token";
import { erc20TokenTransactionRouter } from "./routers/erc20transaction";
import { chainRouter } from "./routers/chain";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  erc20token: erc20TokenRouter,
  erc20transactions: erc20TokenTransactionRouter,
  transactions: transactionRouter,
  wallets: walletRouter,
  chains: chainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

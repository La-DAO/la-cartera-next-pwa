import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const walletRouter = createTRPCRouter({
  createWallet: publicProcedure
    .input(
      z.object({
        address: z.string(),
        type: z.enum(["PRIVY", "SAFE", "EOA"]),
        verifiedName: z.string().optional(),
        name: z.string().optional(),
        ownerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wallet.create({
        data: input,
      });
    }),

  getUserWallets: publicProcedure
    .input(z.object({ ownerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { ownerId } = input;
      // Fetch a user by ID from the database using Prisma
      const wallets = await ctx.db.wallet.findMany({
        where: { ownerId },
      });

      return wallets;
    }),

  updateWallet: publicProcedure
    .input(
      z.object({
        address: z.string(),
        name: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { address } = input;
      return ctx.db.wallet.update({
        where: {
          address,
        },
        data: input,
      });
    }),

  deleteWallet: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { address } = input;
      return ctx.db.wallet.delete({
        where: {
          address,
        },
      });
    }),
});

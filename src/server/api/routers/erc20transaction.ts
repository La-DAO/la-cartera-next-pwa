import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const erc20TokenTransactionRouter = createTRPCRouter({
  createErc20TokenTransaction: publicProcedure
    .input(
      z.object({
        txHash: z.string(),
        senderId: z.string(),
        receiverId: z.string().optional(),
        receiverAddress: z.string(),
        amount: z.number(),
        erc20ContractAddress: z.string(),
        status: z
          .enum(["DRAFT", "PENDING", "CONFIRMED", "FAILED"])
          .default("PENDING"),
        chainId: z.number().default(137),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.erc20TokenTransaction.create({
        data: input,
      });
    }),

  getErc20TokenTransactionByTxHash: publicProcedure
    .input(
      z.object({
        txHash: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { txHash } = input;
      return ctx.db.erc20TokenTransaction.findUnique({
        where: {
          txHash,
        },
      });
    }),

  updateErc20TokenTransaction: publicProcedure
    .input(
      z.object({
        txHash: z.string(),
        status: z.enum(["DRAFT", "PENDING", "CONFIRMED", "FAILED"]),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.erc20TokenTransaction.update({
        where: {
          txHash: input.txHash,
        },
        data: input,
      });
    }),

  deleteErc20TokenTransaction: publicProcedure
    .input(
      z.object({
        txHash: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { txHash } = input;
      return ctx.db.erc20TokenTransaction.delete({
        where: {
          txHash,
        },
      });
    }),
});

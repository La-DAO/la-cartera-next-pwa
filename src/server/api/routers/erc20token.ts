import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const erc20TokenRouter = createTRPCRouter({
  createErc20Token: publicProcedure
    .input(
      z.object({
        contractAddress: z.string(),
        name: z.string(),
        symbol: z.string(),
        decimals: z.number(),
        totalSupply: z.number(),
        chainId: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.erc20Token.create({
        data: input,
      });
    }),

  getErc20TokenByAddress: publicProcedure
    .input(
      z.object({
        contractAddress: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { contractAddress } = input;
      return ctx.db.erc20Token.findUnique({
        where: {
          contractAddress,
        },
      });
    }),

  updateErc20Token: publicProcedure
    .input(
      z.object({
        contractAddress: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.erc20Token.update({
        where: {
          contractAddress: input.contractAddress,
        },
        data: input,
      });
    }),

  deleteErc20Token: publicProcedure
    .input(
      z.object({
        contractAddress: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { contractAddress } = input;
      return ctx.db.erc20Token.delete({
        where: {
          contractAddress,
        },
      });
    }),
});

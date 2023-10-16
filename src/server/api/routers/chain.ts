import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chainRouter = createTRPCRouter({
  createChain: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.chain.create({
        data: input,
      });
    }),
});

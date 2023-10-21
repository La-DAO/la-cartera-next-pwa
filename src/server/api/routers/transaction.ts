import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const transactionRouter = createTRPCRouter({
  createTransaction: publicProcedure
    .input(
      z.object({
        senderId: z.string(),
        receiverId: z.string().optional(),
        receiverAddress: z.string(),
        amount: z.number(),
        status: z
          .enum(["DRAFT", "PENDING", "CONFIRMED", "FAILED"])
          .default("PENDING"),
        chainId: z.number().default(137),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction.create({
        data: input,
      });
    }),

  getTransactionById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.db.transaction.findUnique({
        where: {
          id,
        },
      });
    }),

  updateTransaction: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["DRAFT", "PENDING", "CONFIRMED", "FAILED"]),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  deleteTransaction: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // Ensure that the user is authenticated or has appropriate permissions
      // You can add your authentication/authorization logic here

      // Use Prisma to delete a transaction by its ID
      const { id } = input;
      return ctx.db.transaction.delete({
        where: {
          id,
        },
      });
    }),
});

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const usernameRegex = /^[a-zA-Z0-9]{5,}$/;

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().trim().regex(usernameRegex),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, username, email } = input;
      const duplicates = await ctx.db.user.findMany({
        where: {
          OR: [{ id }, { username }, { email }],
        },
      });

      if (duplicates.length > 0) {
        const usernameExists = duplicates.find(
          (user) => username === user.username
        );
        if (usernameExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Nombre de usuario no disponible, intenta con otro.`,
          });
        } else {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Ya existe un usuario registrado con tu correo.`,
          });
        }
      }

      const newUser = await ctx.db.user.create({
        data: input,
      });

      return newUser;
    }),

  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch a user by ID from the database using Prisma
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("No existe el usuario");
      }

      return user;
    }),

  updateUserWallet: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          privyWallet: z.string().optional(),
          safeWallet: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update a user in the database using Prisma
      const updatedUser = await ctx.db.user.update({
        where: { id: input.id },
        data: input.data,
      });

      return updatedUser;
    }),

  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete a user from the database using Prisma
      const deletedUser = ctx.db.user.delete({
        where: { id: input.id },
      });

      return deletedUser;
    }),

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    // Fetch all users from the database using Prisma
    const users = ctx.db.user.findMany();
    return users;
  }),
});

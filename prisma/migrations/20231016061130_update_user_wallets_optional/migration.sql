/*
  Warnings:

  - The primary key for the `Erc20Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Erc20Token` table. All the data in the column will be lost.
  - You are about to drop the column `tokenId` on the `Erc20TokenTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[privyWallet]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[safeWallet]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `erc20ContractAddress` to the `Erc20TokenTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Erc20TokenTransaction" DROP CONSTRAINT "Erc20TokenTransaction_tokenId_fkey";

-- DropIndex
DROP INDEX "Erc20Token_contractAddress_key";

-- AlterTable
ALTER TABLE "Erc20Token" DROP CONSTRAINT "Erc20Token_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Erc20Token_pkey" PRIMARY KEY ("contractAddress");

-- AlterTable
ALTER TABLE "Erc20TokenTransaction" DROP COLUMN "tokenId",
ADD COLUMN     "erc20ContractAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "privyWallet" DROP NOT NULL,
ALTER COLUMN "safeWallet" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_privyWallet_key" ON "User"("privyWallet");

-- CreateIndex
CREATE UNIQUE INDEX "User_safeWallet_key" ON "User"("safeWallet");

-- AddForeignKey
ALTER TABLE "Erc20TokenTransaction" ADD CONSTRAINT "Erc20TokenTransaction_erc20ContractAddress_fkey" FOREIGN KEY ("erc20ContractAddress") REFERENCES "Erc20Token"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

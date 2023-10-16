/*
  Warnings:

  - A unique constraint covering the columns `[ens]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverAddress` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "receiverAddress" TEXT NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "ens" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ens_key" ON "Wallet"("ens");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

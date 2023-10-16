/*
  Warnings:

  - You are about to drop the column `receiver` on the `Erc20TokenTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `Erc20TokenTransaction` table. All the data in the column will be lost.
  - Added the required column `receiverAddress` to the `Erc20TokenTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Erc20TokenTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Erc20TokenTransaction" DROP COLUMN "receiver",
DROP COLUMN "sender",
ADD COLUMN     "receiverAddress" TEXT NOT NULL,
ADD COLUMN     "receiverId" TEXT,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Erc20TokenTransaction" ADD CONSTRAINT "Erc20TokenTransaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Erc20TokenTransaction" ADD CONSTRAINT "Erc20TokenTransaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

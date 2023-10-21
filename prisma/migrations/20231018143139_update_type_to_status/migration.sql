/*
  Warnings:

  - You are about to drop the column `type` on the `Erc20TokenTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Erc20TokenTransaction" DROP COLUMN "type",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

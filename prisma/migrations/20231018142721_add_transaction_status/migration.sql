/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Erc20TokenTransaction` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Chain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Erc20Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Erc20TokenTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'FAILED');

-- AlterTable
ALTER TABLE "Chain" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Erc20Token" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Erc20TokenTransaction" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "type" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

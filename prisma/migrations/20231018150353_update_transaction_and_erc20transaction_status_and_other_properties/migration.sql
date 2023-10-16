/*
  Warnings:

  - The `status` column on the `Erc20TokenTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `chainId` to the `Erc20Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `Erc20TokenTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Erc20Token" ADD COLUMN     "category" TEXT,
ADD COLUMN     "chainId" INTEGER NOT NULL,
ADD COLUMN     "verifiedName" TEXT;

-- AlterTable
ALTER TABLE "Erc20TokenTransaction" ADD COLUMN     "chainId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Transferencia',
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "chainId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Transferencia',
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Erc20Token" ADD CONSTRAINT "Erc20Token_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Erc20TokenTransaction" ADD CONSTRAINT "Erc20TokenTransaction_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `invoiceNo` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoice_invoiceNo_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "invoiceNo",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_uid_key" ON "Invoice"("uid");

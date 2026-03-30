/*
  Warnings:

  - You are about to drop the `BusinessAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BusinessAddress" DROP CONSTRAINT "BusinessAddress_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "BusinessAddress";

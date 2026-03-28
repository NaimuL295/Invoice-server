/*
  Warnings:

  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - Added the required column `item_name` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "name",
ADD COLUMN     "item_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL;

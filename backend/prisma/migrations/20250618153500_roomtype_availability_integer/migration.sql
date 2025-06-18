/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "availability" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Inventory";

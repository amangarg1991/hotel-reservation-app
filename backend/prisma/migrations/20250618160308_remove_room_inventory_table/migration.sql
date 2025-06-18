/*
  Warnings:

  - You are about to drop the column `availability` on the `RoomType` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `RoomType` table. All the data in the column will be lost.
  - You are about to drop the `RoomInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomInventory" DROP CONSTRAINT "RoomInventory_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "RoomType" DROP COLUMN "availability",
DROP COLUMN "date";

-- DropTable
DROP TABLE "RoomInventory";

/*
  Warnings:

  - Added the required column `roomTypeId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "roomTypeId" INTEGER;

-- Update existing records with a default room type (assuming first room type exists)
UPDATE "Reservation" SET "roomTypeId" = (SELECT id FROM "RoomType" LIMIT 1) WHERE "roomTypeId" IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE "Reservation" ALTER COLUMN "roomTypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "RoomInventory" (
    "id" SERIAL NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "availability" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomInventory_roomTypeId_date_idx" ON "RoomInventory"("roomTypeId", "date");

-- AddForeignKey
ALTER TABLE "RoomInventory" ADD CONSTRAINT "RoomInventory_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

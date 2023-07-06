/*
  Warnings:

  - The primary key for the `SheetSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SheetSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SheetSchedule" DROP CONSTRAINT "SheetSchedule_pkey",
DROP COLUMN "id",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "SheetSchedule_pkey" PRIMARY KEY ("teamId", "date", "member");

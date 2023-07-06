/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `weekScheduleId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `weekScheduleId` on the `DiscordMessage` table. All the data in the column will be lost.
  - The primary key for the `WeekSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WeekSchedule` table. All the data in the column will be lost.
  - Added the required column `weekScheduleFirstDay` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekScheduleTeamId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekScheduleFirstDay` to the `DiscordMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekScheduleTeamId` to the `DiscordMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_weekScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordMessage" DROP CONSTRAINT "DiscordMessage_weekScheduleId_fkey";

-- DropIndex
DROP INDEX "Appointment_weekScheduleId_date_timeSlot_key";

-- DropIndex
DROP INDEX "WeekSchedule_teamId_firstDay_key";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "id",
DROP COLUMN "weekScheduleId",
ADD COLUMN     "weekScheduleFirstDay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weekScheduleTeamId" INTEGER NOT NULL,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("weekScheduleTeamId", "date", "timeSlot");

-- AlterTable
ALTER TABLE "DiscordMessage" DROP COLUMN "weekScheduleId",
ADD COLUMN     "weekScheduleFirstDay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weekScheduleTeamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WeekSchedule" DROP CONSTRAINT "WeekSchedule_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "WeekSchedule_pkey" PRIMARY KEY ("teamId", "firstDay");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_weekScheduleTeamId_weekScheduleFirstDay_fkey" FOREIGN KEY ("weekScheduleTeamId", "weekScheduleFirstDay") REFERENCES "WeekSchedule"("teamId", "firstDay") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordMessage" ADD CONSTRAINT "DiscordMessage_weekScheduleTeamId_weekScheduleFirstDay_fkey" FOREIGN KEY ("weekScheduleTeamId", "weekScheduleFirstDay") REFERENCES "WeekSchedule"("teamId", "firstDay") ON DELETE RESTRICT ON UPDATE CASCADE;

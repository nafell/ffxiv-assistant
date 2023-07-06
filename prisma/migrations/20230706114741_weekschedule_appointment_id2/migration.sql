/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("weekScheduleTeamId", "weekScheduleFirstDay", "date", "timeSlot");

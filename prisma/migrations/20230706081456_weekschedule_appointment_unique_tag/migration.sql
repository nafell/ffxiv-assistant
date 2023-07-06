/*
  Warnings:

  - A unique constraint covering the columns `[weekScheduleId,date,timeSlot]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,firstDay]` on the table `WeekSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_weekScheduleId_date_timeSlot_key" ON "Appointment"("weekScheduleId", "date", "timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "WeekSchedule_teamId_firstDay_key" ON "WeekSchedule"("teamId", "firstDay");

-- CreateEnum
CREATE TYPE "FfxivRole" AS ENUM ('MT', 'ST', 'PH', 'BH', 'D1', 'D2', 'D3', 'D4');

-- CreateEnum
CREATE TYPE "ParticipationPossibility" AS ENUM ('able', 'conditional', 'unable', 'unentered');

-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('Morning', 'AM', 'Noon', 'Afternoon', 'Evening', 'Night', 'Midnight');

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "discordGuildId" BIGINT NOT NULL,
    "sheetScheduleUrl" TEXT,
    "sheetscheduleSheetName" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetSchedule" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "canParticipate" "ParticipationPossibility" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "member" "FfxivRole" NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "SheetSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekSchedule" (
    "id" SERIAL NOT NULL,
    "firstDay" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "WeekSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" "TimeSlot" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "objective" TEXT,
    "note" TEXT,
    "isScheduled" BOOLEAN NOT NULL,
    "isCancelled" BOOLEAN NOT NULL,
    "weekScheduleId" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordChannel" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,

    CONSTRAINT "DiscordChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordMessage" (
    "id" BIGINT NOT NULL,
    "weekScheduleId" INTEGER NOT NULL,
    "discordChannelId" BIGINT NOT NULL,

    CONSTRAINT "DiscordMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiscordChannelToTeam" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DiscordChannelToTeam_AB_unique" ON "_DiscordChannelToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscordChannelToTeam_B_index" ON "_DiscordChannelToTeam"("B");

-- AddForeignKey
ALTER TABLE "SheetSchedule" ADD CONSTRAINT "SheetSchedule_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekSchedule" ADD CONSTRAINT "WeekSchedule_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_weekScheduleId_fkey" FOREIGN KEY ("weekScheduleId") REFERENCES "WeekSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordMessage" ADD CONSTRAINT "DiscordMessage_weekScheduleId_fkey" FOREIGN KEY ("weekScheduleId") REFERENCES "WeekSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordMessage" ADD CONSTRAINT "DiscordMessage_discordChannelId_fkey" FOREIGN KEY ("discordChannelId") REFERENCES "DiscordChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscordChannelToTeam" ADD CONSTRAINT "_DiscordChannelToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscordChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscordChannelToTeam" ADD CONSTRAINT "_DiscordChannelToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

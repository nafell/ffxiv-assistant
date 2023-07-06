import { isDiscordGuildAuth } from "@/lib/Discord/DiscordGuildAuth";
import prisma from "@/lib/prisma";
import { FfxivRole, ParticipationPossibility, Prisma, SheetSchedule } from "@prisma/client";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// GET api/spreadsheet/[id]/sheetschedule
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const discordAuth = await isDiscordGuildAuth(request, params.id)

    if (!discordAuth){
        return new Response(JSON.stringify({
            error:"unauthorized",
        }),
        {
            status: 401,
        }
        );
    }

    const teamId = Number(params.id)
    if (Number.isNaN(teamId))
    {
        return new Response(JSON.stringify({
            error:"Id is not a number.",
        }),
        {
            status: 400,
        }
        );
    }

    const {searchParams} = request.nextUrl
    const sheetName = searchParams.get("sheet")
    if (!sheetName)
    {
        return new Response(JSON.stringify({
            error:"url parameter \"sheet\" is required",
        }),
        {
            status: 400,
        }
        );
    }


    // ====================
    // Access Google Sheets

    const team = await prisma.team.findFirst({where: { id: teamId }})
    const spreadsheetId = team?.sheetScheduleUrl!

    const sheetsAuth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
    const sheets = google.sheets({ version: "v4", auth: sheetsAuth });

    const range = sheetName + "!D3:AP13"

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        valueRenderOption: "UNFORMATTED_VALUE"
    })


    // ====================
    // Parse

    if (!response.data.values)
    {
        return new Response(JSON.stringify({
            error:"No data returned from sheet",
        }),
        {
            status: 400,
        }
        );
    }

    const schedules = parseSchedule(response.data.values, teamId)
    await upsertSchedules(schedules)

    return NextResponse.json(schedules)
}

async function upsertSchedules(schedules: SheetSchedule[]) {
    const query = schedules.map(schedule => (
        prisma.sheetSchedule.upsert({
            where: {
                teamId_date_member: {
                    teamId: schedule.teamId,
                    date: schedule.date,
                    member: schedule.member
                },
            },
            update: {
                canParticipate: schedule.canParticipate,
                updatedAt: schedule.updatedAt
            },
            create: {
                ...schedule
            }
        })
    ))

    const result = await prisma.$transaction([...query])

    return result
}

const parseSchedule = (table: string[][], teamId: number) => {
    let now = new Date()
    let schedules: SheetSchedule[] = []
    const columnCount = table[0].length
    const rowCount = table.length

    // parse vertical data, scan horizontally
    for (let column = 0; column < columnCount; column++) {
        // (Vertical): [date][_][_][MT][ST][PH][BH][D1][D2][D3][D4]

        let date = new Date(1899, 12,30) //Google Sheets' date integer epoch
        date.setDate(date.getDate() + Number(table[0][column]))

        for (let row = 3; row < rowCount; row++) {
            schedules.push({
                date,
                canParticipate: parseScheduleAvailability(table[row][column]),
                member: rowNumberToFfxivRole(row),
                teamId,
                updatedAt: now
            })
        }
    }

    return schedules
}

function parseScheduleAvailability(raw: string) {
    if (raw === "◯") {
        return ParticipationPossibility.able
    }
    if (raw === "△") {
        return ParticipationPossibility.conditional
    }
    if (raw === "✕") {
        return ParticipationPossibility.unable
    }

    return ParticipationPossibility.unentered
}

function rowNumberToFfxivRole(row: number) {
    if (row == 3) {
        return FfxivRole.MT
    }
    if (row == 4) {
        return FfxivRole.ST
    }
    if (row == 5) {
        return FfxivRole.PH
    }
    if (row == 6) {
        return FfxivRole.BH
    }
    if (row == 7) {
        return FfxivRole.D1
    }
    if (row == 8) {
        return FfxivRole.D2
    }
    if (row == 9) {
        return FfxivRole.D3
    }

    return FfxivRole.D4
}
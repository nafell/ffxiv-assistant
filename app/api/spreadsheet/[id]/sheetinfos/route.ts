import { isDiscordGuildAuth } from '@/lib/Discord/DiscordGuildAuth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSheetsClient } from '@/lib/GoogleSheets/SheetsClient';

// GET api/spreadsheet/[id]/sheetinfos
// returns {sheetId, name} of every sheet in the team's spreadsheet
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

    //get sheetId from prisma
    const team = await prisma.team.findFirst({where: { id: teamId }})
    const spreadsheetId = team?.sheetScheduleUrl

    if (!spreadsheetId)
    {
        return new Response(JSON.stringify({
            error:"spreadsheet id is not set for this team.",
        }),
        {
            status: 400,
        }
        );
    }

    const response = await (await getSheetsClient()).spreadsheets.get({ spreadsheetId })

    const sheetInfos:SheetInfo[] = []
    if(response.data.sheets)
    {
        for (let sheet of response.data.sheets)
        {
            if (sheet.properties)
            {
                sheetInfos.push({
                    sheetId: sheet.properties.sheetId!,
                    title: sheet.properties.title!
                })
            }
        }
    }

    return new Response(JSON.stringify(sheetInfos))
}

export interface SheetInfo {
    sheetId: number
    title: string
}
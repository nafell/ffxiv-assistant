import { verifyJwt } from '@/lib/jwt';
import { decryptDiscordToken, isDiscordGuildAuth } from '@/lib/DiscordGuildAuth';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const team = await prisma.team.findFirst({
        where: {
            id: teamId
        }
    })
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

    const sheetsAuth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
    const sheets = google.sheets({ version: "v4", auth: sheetsAuth })

    const response = await sheets.spreadsheets.get({ spreadsheetId })

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
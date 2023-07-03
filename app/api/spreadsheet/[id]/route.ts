import { verifyJwt } from '@/lib/jwt';
import { decryptDiscordToken, isDiscordGuildAuth } from '@/lib/DiscordGuildAuth';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

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

    // if (!params.teamId) {
    //     return new Response(JSON.stringify({
    //         error:"bad request",
    //     }),
    //     {
    //         status: 400,
    //     }
    //     );
    // }

    //authorization

    //get sheetId from prisma
    const spreadsheetId = process.env.SHEETS_ID

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
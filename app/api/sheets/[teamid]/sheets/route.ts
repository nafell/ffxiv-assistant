import { verifyJwt } from '@/app/lib/jwt';
import { google } from 'googleapis';
import { ParsedUrlQuery } from 'querystring';

export interface SheetTeamParams extends ParsedUrlQuery {
    teamId?: string
}

export default async function GET(request: Request, params: SheetTeamParams) {
    if (!params.teamId) {
        return new Response(JSON.stringify({
            error:"bad request",
        }),
        {
            status: 400,
        }
        );
    }

    //authorization

    //get sheetId from prisma

    const sheetsAuth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
    const sheets = google.sheets({ version: "v4", auth: sheetsAuth });

    const response = await sheets.spreadsheets.get({
        spreadsheetId: process.env.SHEETS_ID
    })

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
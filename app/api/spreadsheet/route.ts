import { verifyJwt } from '@/lib/jwt';
import { isDiscordGuildAuth } from '@/lib/DiscordGuildAuth';
import { google } from 'googleapis';
import { NextRequest } from 'next/server';

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


    const sheetsAuth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
    const sheets = google.sheets({ version: "v4", auth: sheetsAuth });

    const range = "日程!D2:AP13"

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEETS_ID,
        range
    })


    let csv: string = ""
    if (response.data.values){
        const table: string[][] = response.data.values
        console.log("================tablelength:" + table.length)
        console.log("================rowlength:" + table[0].length)
        for (let rows of table) {
            for (let cell of rows) {
                csv = csv.concat(cell)
                csv = csv.concat(",")
            }
            csv = csv.concat("\n")
        }
        console.log(csv)

        return new Response(JSON.stringify(csv))
    }
}

const parseSchedule = async (table: string[][]) => {
    let csv: string = ""

    for (let rows of table) {
        for (let cell of rows) {
            csv = csv.concat(cell)
            csv = csv.concat(",")
        }
        csv = csv.concat("\n")
    }

    console.log(csv)

    return csv
}
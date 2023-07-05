import { isDiscordGuildAuth } from "@/lib/Discord/DiscordGuildAuth";
import { google } from "googleapis";
import { NextRequest } from "next/server";

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

    // const {searchParams} = request.nextUrl
    // const sheetId = searchParams.get("sheet")
    // const teamId = searchParams.get("team")
    // let spreadsheetId = searchParams.get("spreadsheet")

    // if (!spreadsheetId && teamId) {
    //     //get spreadsheetId from prisma
    // }

    // console.log("=================sheetid:" + sheetId)



    // const sheetsAuth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
    // const sheets = google.sheets({ version: "v4", auth: sheetsAuth });

    // const range = "日程!D2:AP13"

    // const response = await sheets.spreadsheets.values.get({
    //     spreadsheetId: process.env.SHEETS_ID,
    //     range
    // })

    return new Response(JSON.stringify("ok"))
}
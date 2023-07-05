import { google } from "googleapis"

export async function getSheetsClient() {
    const sheetsAuth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
    return google.sheets({ version: "v4", auth: sheetsAuth })
}
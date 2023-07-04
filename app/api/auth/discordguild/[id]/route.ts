import { isDiscordGuildAuth, isGuildMember } from "@/lib/DiscordGuildAuth";
import { NextRequest, NextResponse } from "next/server";


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

    return NextResponse.json("ok")
}
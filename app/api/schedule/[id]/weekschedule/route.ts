import { isDiscordGuildAuth } from "@/lib/Discord/DiscordGuildAuth";
import prisma from "@/lib/prisma";
import { Appointment, WeekSchedule } from "@prisma/client";
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
    let cursorDate = new Date()
    if (searchParams.has("all")) {
        cursorDate = new Date(1901, 1, 1) //arbitrary old date to include all
    }
    else if (searchParams.has("relevant")){
        // lastweek + thisweek + future
        cursorDate = new Date(cursorDate.setDate(cursorDate.getDate() - 14))
    }
    else {
        const after = searchParams.get("after")
        if (after) {
            cursorDate = new Date(Date.parse(after))
        }
    }

    const weekSchedules = await prisma.weekSchedule.findMany({
        where: {
            teamId: teamId,
            firstDay: {
                gte: cursorDate
            }
        },
        include: {
            appointments: true
        }
    })

    return NextResponse.json(weekSchedules)
}
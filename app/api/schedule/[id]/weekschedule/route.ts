import { isDiscordGuildAuth } from "@/lib/Discord/DiscordGuildAuth";
import prisma from "@/lib/prisma";
import { Appointment, WeekSchedule } from "@prisma/client";
import { NextApiRequest } from "next";
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
    const firstDayString = searchParams.get("firstDay")
    if (!firstDayString)
    {
        return new Response(JSON.stringify({
            error:"url parameter \"firstDay\" is required",
        }),
        {
            status: 400,
        }
        );
    }

    const firstDay = new Date(firstDayString)

    const weekSchedule = await prisma.weekSchedule.findFirst({
        where: {
            teamId,
            firstDay
        }
    })

    return weekSchedule
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const weekSchedule:WeekScheduleWithAppointments =  await request.json()
    if (!weekSchedule){
        return new Response(JSON.stringify({
            error:"Include WeekSchedule as request body",
        }),
        {
            status: 400,
        }
        );
    }

    const {appointments, ...weekScheduleOnly} = weekSchedule

    const result = await prisma.weekSchedule.upsert({
        where: {
            teamId_firstDay: {
                teamId,
                firstDay:weekSchedule.firstDay
            }
        },
        update: {
            ...weekScheduleOnly
        },
        create: {
            ...weekScheduleOnly
        }
    })

    const aresult = await prisma.appointment.upsert({
        where: {
            weekScheduleTeamId_weekScheduleFirstDay_date_timeSlot: {
                weekScheduleTeamId: teamId,
                weekScheduleFirstDay: weekSchedule.firstDay,
                date:weekSchedule.appointments[0].date,
                timeSlot:weekSchedule.appointments[0].timeSlot
            }
        },
        update: {
            ...weekSchedule.appointments[0]
        },
        create: {
            ...weekSchedule.appointments[0]
        }
    })

    return NextResponse.json("ok")
}

export interface WeekScheduleWithAppointments extends WeekSchedule {
    appointments: Appointment[]
}
import { isDiscordGuildAuth } from "@/lib/Discord/DiscordGuildAuth";
import prisma from "@/lib/prisma";
import { Appointment, WeekSchedule } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string, firstDay: string } }) {
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
    const firstDayDate = new Date(Date.parse(params.firstDay))
    if (Number.isNaN(teamId) || !firstDayDate)
    {
        return new Response(JSON.stringify({
            error:"URL is invalid.",
        }),
        {
            status: 400,
        }
        );
    }

    const weekSchedule = await prisma.weekSchedule.findFirst({
        where: {
            teamId,
            firstDay: {
                gte: firstDayDate
            }
        },
        include: {
            appointments: true
        }
    })

    if (!weekSchedule){
        return new Response(JSON.stringify({
            error:"Could not find the specified WeekSchedule in the database",
        }),
        {
            status: 404,
        }
        );
    }

    return NextResponse.json(weekSchedule)
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

    const weekSchedule:WeekScheduleInflated =  await request.json()
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

    const appointmentsQuery = appointments.map(appointment => (
        prisma.appointment.upsert({
            where: {
                weekScheduleTeamId_weekScheduleFirstDay_date_timeSlot: {
                    weekScheduleTeamId: teamId,
                    weekScheduleFirstDay: weekSchedule.firstDay,
                    date:appointment.date,
                    timeSlot:appointment.timeSlot
                }
            },
            update: {
                ...appointment
            },
            create: {
                ...appointment
            }
        })
    ))

    const [appointmentResults, scheduleResult] = await Promise.all([
        prisma.$transaction([...appointmentsQuery]),
        prisma.weekSchedule.upsert({
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
    ])

    return NextResponse.json("ok")
}

export interface WeekScheduleInflated extends WeekSchedule {
    appointments: Appointment[]
}
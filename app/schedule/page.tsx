"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import DiscordLoginButton from '@/components/DiscordLoginButton';
import { Appointment, TimeSlot, WeekSchedule } from '@prisma/client';
import { WeekScheduleInflated } from '../api/schedule/[id]/weekschedule/[firstDay]/route';
import ScheduleTable from './_components/ScheduleTable';

const schedulePage = () => {
    const { data: session } = useSession();
    const [ authorized, setAuthorized ] = useState(false);
    const [ guildName, setGuildName ] = useState("guild Name Here")

    const [ csvData, setCsvData ] = useState("data here")

    const getSpreadsheetInfo = async () => {
        const a = await fetch(`${location.origin}/api/spreadsheet/1/sheetinfos`, {
            method: 'get',
            headers: new Headers({
                "discordToken": session?.user?.discordToken!
            })
        })
        const b = await a.text()
        setCsvData(b)
    }

    const getSheetsSchedule = async () => {
        const a = await fetch(`${location.origin}/api/spreadsheet/1/sheetschedule?sheet=日程`,{
            method: 'get',
            headers: new Headers({
                "discordToken": session?.user?.discordToken!
            }) 
        })
    }

    const postWeekSchedule = async () => {


        const w:WeekScheduleInflated = {
            teamId:1,
            firstDay: new Date(2023,7,4),
            appointments: []
        }

        const a:Appointment = {
            date: new Date(2023,7,4),
            timeSlot: TimeSlot.Night,
            startTime: new Date(2023,7,4,21,30,0),
            endTime: new Date(2023,7,4,23,30,0),
            objective: "",
            note: "",
            isScheduled: true,
            isCancelled: false,

            weekScheduleTeamId: 1,
            weekScheduleFirstDay: w.firstDay
        }

        w.appointments.push(a)

        const res = await fetch(`${location.origin}/api/schedule/1/weekschedule`,{
            method: 'post',
            headers: new Headers({
                "discordToken": session?.user?.discordToken!,
                "Content-Type": 'application/json'
            }) ,
            body: JSON.stringify(w)
        })
    }

    useEffect(() => {
        checkAuth();
    })

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                light: '#ff008d',
                main: '#ff008d',
                dark: '#ff008d',
            },
            success: {
                light: "#4ade80",
                main: "#4ade80",
                dark: "#4ade80"
            }
        },
        
    })

    const checkAuth = async () => {
        if (authorized == true) return;
        if (!session || !session.user){
            return;
        }

        const res = await fetch(`${location.origin}/api/auth/discordguild/1/`, {
            method: 'get',
            headers: new Headers({
                "discordToken": session.user.discordToken
            })
        })

        if (res.status == 200)
        {
            setGuildName("ログイン成功")
            setAuthorized(true)
        }
    }

    return (<ThemeProvider theme={theme}><div className="w-full flex flex-col items-center">
        <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
            <DiscordLoginButton></DiscordLoginButton>
            { (session && session.user) ? (
            <>
                { authorized ? (
                    <div className="flex flex-col items-center mb-4 lg:mb-12">
                        Conglaturations! You are a member of <b>{guildName}</b> and authorized.
                        <button onClick={getSpreadsheetInfo}>getSpreadsheetInfo</button>
                        <button onClick={getSheetsSchedule}>getSheetsSchedule</button>
                        <button onClick={postWeekSchedule}>postWeekSchedule</button>
                        <p>{csvData}</p>
                        <ScheduleTable authorized={authorized}></ScheduleTable>
                    </div>


                ) : (<div className="flex flex-col items-center mb-4 lg:mb-12">Not authorized.</div>)
                }
            </>
            ) : (
                <div className="flex flex-col items-center mb-4 lg:mb-12">
                    Please login to authorize.
                </div>
            )
            }

        </div>
    </div></ThemeProvider>)
}
export default schedulePage;
"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import DiscordLoginButton from '@/components/DiscordLoginButton';

const schedulePage = () => {
    const { data: session } = useSession();
    const [ auth, setAuth ] = useState(false);
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
        if (auth == true) return;
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
            setAuth(true)
        }
    }

    return (<ThemeProvider theme={theme}><div className="w-full flex flex-col items-center">
        <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
            <DiscordLoginButton></DiscordLoginButton>
            { (session && session.user) ? (
            <>
                { auth ? (
                    <div className="flex flex-col items-center mb-4 lg:mb-12">
                        Conglaturations! You are a member of <b>{guildName}</b> and authorized.
                        <button onClick={getSpreadsheetInfo}>getSpreadsheetInfo</button>
                        <button onClick={getSheetsSchedule}>getSheetsSchedule</button>
                        <p>{csvData}</p>
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
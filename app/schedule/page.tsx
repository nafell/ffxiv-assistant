"use client"

import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import DiscordLoginButton from '@/components/DiscordLoginButton';
import { useSession } from 'next-auth/react';
import { isGuildMember } from '../lib/DiscordGuildAuth';

const schedulePage = () => {
    const { data: session } = useSession();
    const [ auth, setAuth ] = useState(false);
    const [ guildName, setGuildName ] = useState("")

    const [ csvData, setCsvData ] = useState("data here")

    const getSheetsInfo = async () => {

        const a = await fetch(`${location.origin}/api/sheets`, {
            method: 'get',
            headers: new Headers({
                "Authorization": session?.user?.image!
            })
        })
        const b = await a.text()
        setCsvData(b)
    }

    const getSpreadSheetSheets = async () => {
        const a = await fetch(`${location.origin}/api/sheets/12345/sheets/`)
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
        if (session && session.user){
            const res = await isGuildMember(session.user.email!, "1095729079002595331")
            if (res)
            {
                setGuildName(res)
                setAuth(true)
            }
        }
        else {
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
                        <button onClick={getSheetsInfo}>fetch</button>
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
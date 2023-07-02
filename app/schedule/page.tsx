"use client"

import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DiscordLoginButton from '@/components/DiscordLoginButton';
import { signOut, SessionProvider, useSession } from 'next-auth/react';
import { isGuildMember } from '../lib/DiscordGuildAuth';

const schedulePage = () => {
    const { data: session } = useSession();
    const [ auth, setAuth ] = useState(false);
    const [ phase, setPhase ] = useState("init")
    const [ guildName, setGuildName ] = useState("")

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
            const res = await isGuildMember(session.user.email!, "1116593800052215889")
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
                    </div>
                ) : (
                    <div className="flex flex-col items-center mb-4 lg:mb-12">
                        Not authorized.
                    </div>
                )
                }
                {/* { (await isGuildMember((session.user.email!), "1095729079002595331")) ? (
                        <>Conguratulations, you are authorized. </>
                    ) : (
                        <>You are not authorized. </>
                    )
                } */}
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
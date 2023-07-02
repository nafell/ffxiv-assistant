"use client"

import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DiscordLoginButton from '@/components/DiscordLoginButton';
import { SessionProvider } from 'next-auth/react';

export default function markerPage() {
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

    const [diceresult, setDiceresult] = useState('')
    const [open, setOpen] = useState(false);

    const createMacro = () => {
        const command = "/marking attack"
        const numbers = [1,2,3,4,5,6,7,8]
        
        let macro = ""
        for (let i = 0; i < 8; i++) {
            macro = macro.concat(command)
            macro = macro.concat((i+1).toString())
            
            const target = Math.floor(Math.random() * (8-i))
            macro = macro.concat(` <${numbers[target]}>`)
            numbers.splice(target, 1)

            macro = macro.concat("\n")
        }

        setDiceresult(macro)
        navigator.clipboard.writeText(macro);
        setOpen(true);
    }
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };



    return (<SessionProvider><ThemeProvider theme={theme}><div className="w-full flex flex-col items-center">
        <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
            <div className="flex flex-col items-center mb-4 lg:mb-12">

                <button className="py-2.5 px-5 rounded-full no-underline text-foreground bg-pink-600 hover:bg-pink-700 flex items-center group text-sm" onClick={createMacro}>サイコロマクロ生成!</button>
                {/* <Button variant='contained' onClick={createMacro} size="large" color="primary">Dice!</Button> */}
                {/* <button
                    className="py-2 px-4 rounded-md no-underline text-foreground bg-indigo-500 hover:bg-indigo-600 flex items-center group text-sm"
                >
                    <div className="mr-1"><svg className="c-eSSyNk" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="21px" height="21px"><path fill="#eef2ff" d="M39.248,10.177c-2.804-1.287-5.812-2.235-8.956-2.778c-0.057-0.01-0.114,0.016-0.144,0.068	c-0.387,0.688-0.815,1.585-1.115,2.291c-3.382-0.506-6.747-0.506-10.059,0c-0.3-0.721-0.744-1.603-1.133-2.291	c-0.03-0.051-0.087-0.077-0.144-0.068c-3.143,0.541-6.15,1.489-8.956,2.778c-0.024,0.01-0.045,0.028-0.059,0.051	c-5.704,8.522-7.267,16.835-6.5,25.044c0.003,0.04,0.026,0.079,0.057,0.103c3.763,2.764,7.409,4.442,10.987,5.554	c0.057,0.017,0.118-0.003,0.154-0.051c0.846-1.156,1.601-2.374,2.248-3.656c0.038-0.075,0.002-0.164-0.076-0.194	c-1.197-0.454-2.336-1.007-3.432-1.636c-0.087-0.051-0.094-0.175-0.014-0.234c0.231-0.173,0.461-0.353,0.682-0.534	c0.04-0.033,0.095-0.04,0.142-0.019c7.201,3.288,14.997,3.288,22.113,0c0.047-0.023,0.102-0.016,0.144,0.017	c0.22,0.182,0.451,0.363,0.683,0.536c0.08,0.059,0.075,0.183-0.012,0.234c-1.096,0.641-2.236,1.182-3.434,1.634	c-0.078,0.03-0.113,0.12-0.075,0.196c0.661,1.28,1.415,2.498,2.246,3.654c0.035,0.049,0.097,0.07,0.154,0.052	c3.595-1.112,7.241-2.79,11.004-5.554c0.033-0.024,0.054-0.061,0.057-0.101c0.917-9.491-1.537-17.735-6.505-25.044	C39.293,10.205,39.272,10.187,39.248,10.177z M16.703,30.273c-2.168,0-3.954-1.99-3.954-4.435s1.752-4.435,3.954-4.435	c2.22,0,3.989,2.008,3.954,4.435C20.658,28.282,18.906,30.273,16.703,30.273z M31.324,30.273c-2.168,0-3.954-1.99-3.954-4.435	s1.752-4.435,3.954-4.435c2.22,0,3.989,2.008,3.954,4.435C35.278,28.282,33.544,30.273,31.324,30.273z"></path></svg>
                    </div>
                    Login with Discord
                </button> */}
                <p>{diceresult}</p>
                <DiscordLoginButton></DiscordLoginButton>

            </div>
        </div>
        <Snackbar open={open} autoHideDuration={1000} anchorOrigin={{vertical:"top", horizontal:"center"}} onClose={handleClose}>
            <Alert severity="success" variant='filled' sx={{ width: '100%' }}>
                コピーしました！
            </Alert>
      </Snackbar>
    </div></ThemeProvider></SessionProvider>)
}
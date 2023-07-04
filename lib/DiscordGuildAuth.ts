import prisma from "@/lib/prisma";
import CryptoES from "crypto-es";
import { NextRequest } from "next/server";

export async function isGuildMember(accessToken: string, guildId:string): Promise<string | null> {
    const res: Response = await fetch("https://discordapp.com/api/users/@me/guilds", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
  
    if (res.ok) {
        const guilds: Guild[] = await res.json();
        const result = guilds.some((guild: Guild) => guild.id === guildId)
        if (!result)
            return null
        const guildName = guilds.find((g) => g.id == guildId)?.name
        return guildName!
    }
    
    return null
}

export async function isTeamMember(accessToken: string, teamId:number): Promise<boolean> {
    const team = await prisma.team.findFirst({
        where: {
            id: teamId
        }
    })

    if (!team)
    {
        return false
    }

    const guildName = await isGuildMember(accessToken, team.discordGuildId.toString())

    if (guildName)
    {
        return true
    } else return false
}

export function decryptDiscordToken(encryptedToken: string){
    return CryptoES.AES.decrypt(encryptedToken, process.env.CRYPTO_KEY).toString(CryptoES.enc.Utf8)
}

export function encryptDiscordToken(rawToken: string) {
    return CryptoES.AES.encrypt(rawToken, process.env.CRYPTO_KEY)
}

export async function isDiscordGuildAuth(nextRequest: NextRequest, teamId: string) : Promise<boolean> {

    const teamIdInt = Number(teamId)
    if (Number.isNaN(teamIdInt)) {
        return false
    }

    const encrypted = nextRequest.headers.get("discordToken")

    if (!encrypted){
        return false
    }

    const discordToken = decryptDiscordToken(encrypted)

    return await isTeamMember(discordToken, teamIdInt)
}

interface Guild {
id: string
name: string
icon: string
owner: boolean
permissions: number
features: string[]
}
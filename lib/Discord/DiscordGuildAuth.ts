import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { decryptDiscordToken } from "./DiscordTokenEncryption";

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
    
    console.log("discod:discord api error")
    console.log(res)
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
        console.log("discod:no team in database")
        return false
    }

    const guildName = await isGuildMember(accessToken, team.discordGuildId.toString())

    if (guildName)
    {
        return true
    } else {
        console.log("discod:user not member of team")
        return false
    }
}

export async function isDiscordGuildAuth(nextRequest: NextRequest, teamId: string) : Promise<boolean> {

    const teamIdInt = Number(teamId)
    if (Number.isNaN(teamIdInt)) {
        console.log("discod:NaN")
        return false
    }

    const encrypted = nextRequest.headers.get("discordToken")

    if (!encrypted){
        console.log("discod:no auth in header")
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
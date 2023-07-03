import prisma from "./prisma";

export async function isGuildMember(accessToken: string, guildId:string): Promise<string | null> {
    const res: Response = await fetch("https://discordapp.com/api/users/@me/guilds", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
  
    if (res.ok) {
        console.log("=====================ok")
        const guilds: Guild[] = await res.json();
        const result = guilds.some((guild: Guild) => guild.id === guildId)
        if (!result)
            return null
        const guildName = guilds.find((g) => g.id == guildId)?.name
        return guildName!
    }
    
    console.log("=====================ng")
    return null
}

export async function isTeamMember(accessToken: string, teamId:number): Promise<string | null> {
    //get guild id from prisma
    //call isGuildMember

    const team = await prisma.team.findFirst({
        where: {
            teamId: teamId
        }
    })

    if (!team)
    {
        return null
    }

    return await isGuildMember(accessToken, team.guildId)
}

interface Guild {
id: string
name: string
icon: string
owner: boolean
permissions: number
features: string[]
}
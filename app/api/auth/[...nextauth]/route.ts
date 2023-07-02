import { Session } from "inspector";
import NextAuth, { DefaultSession, Profile } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const authOptions = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: { scope: 'identify guilds' },
      }
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && account.access_token) {
        token.email = account.access_token;
      }
      return token;
    },

    async session({session, token}) {
      if (session.user) {
        session.user.email = token.email
      }
      return session;
    }
  }

  // session: {strategy: "jwt"},

  // callbacks: {
  //   jwt: ({token, user}) => {
  //     return ({...token, ...user});
  //   },

  //   session: ({session, token}) => {
  //     session.user = token as any;
  //     return session;
  //   },

    
  //   // /**
  //   //   * sessionにaccessTokenと、user.idを追加
  //   //   */
  //   // session: async ({ session, token }) => {
  //   //   const dSession = session as DiscordSession
  //   //   dSession.accessToken = token.accessToken;
  //   //   if (session.user) {
  //   //     // session.user.id = token.id;
  //   //     session.user.name = JSON.stringify(token.id);
  //   //   }
  //   //   return session;
  //   // },

  //   // /**
  //   //   * jwtにaccessTokenと、profile.idを追加
  //   //   */
  //   // jwt: async ({ token, account, profile }) => {
  //   //   if (account && account.access_token) {
  //   //     token.accessToken = account.access_token;
  //   //   }
  //   //   if (profile) {
  //   //     const dProfile = profile as DiscordProfile
  //   //    token.id = dProfile.id;
  //   //   }
  //   //   return token;
  //   // },

  //   signIn: async ({ account, user, profile }) => {
  //     if (account == null || account.access_token == null) return false;
  //     console.log("====================token OK")
  //     console.log(user.name)
  //     return await isGuildMember(account.access_token, "1095729079002595331");
  //   }
  // },
});
export {authOptions as GET, authOptions as POST}

interface DiscordSession extends DefaultSession {
  accessToken: any
}

interface DiscordProfile extends Profile {
  id: any
}

interface Guild {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions: number
  features: string[]
}

async function isGuildMember(accessToken: string, guildId:string): Promise<boolean> {
  const res: Response = await fetch("https://discordapp.com/api/users/@me/guilds", {
      headers: {
          Authorization: `Bearer ${accessToken}`,
      }
  });

  if (res.ok) {
      const guilds: Guild[] = await res.json();
      return guilds.some((guild: Guild) => guild.id === guildId)
  }

  return false
}
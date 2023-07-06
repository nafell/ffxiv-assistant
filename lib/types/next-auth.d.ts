import NextAuth from "next-auth/next";

declare module 'next-auth' {
    interface Session{
        user:{
            id:number;
            name:string;
            email:string;
            discordToken:string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        discordToken:string;
    }
}
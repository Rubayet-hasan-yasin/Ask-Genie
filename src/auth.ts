import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token?.sub) {
                session.user.id = token.sub; // Attach user id to session
            }
            return session;
        },
    },
})
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "@/utils/db";
import bcrypt from "bcrypt";
import User from "@/models/user";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", placeholder: "Enter Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                //Check if the user exists.
                await connect();

                try {
                    //1. First find if user exists
                    const user: any = await User.findOne({
                        email: credentials.email,
                    }).exec();

                    //2. If the user exists then compare the password
                    //adding the password === user.password is a temporary fix for users who registered before the password hashing was implemented
                    if (user) {
                        const isPasswordCorrect =
                            (await bcrypt.compare(
                                credentials.password,
                                user.password,
                            )) || credentials.password === user.password;

                        if (isPasswordCorrect) {
                            return user;
                        } else {
                            throw new Error("Wrong Credentials!");
                        }
                    } else {
                        throw new Error("User not found!");
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            /* Step 1: update the token based on the user object */
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            /* Step 2: update the session.user based on the token object */
            if (token && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

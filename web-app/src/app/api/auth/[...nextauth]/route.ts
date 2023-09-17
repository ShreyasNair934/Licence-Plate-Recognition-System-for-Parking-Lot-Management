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
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

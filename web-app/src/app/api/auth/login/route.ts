import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/user";
import bcrypt from "bcrypt";

//POST is preferred over GET for login because we don't want to send the password in the URL
export const POST = async (request: any) => {
    //1. Get the request body which contains the email and password
    const { email, password } = await request.json();

    try {
        //2. Connect to the database
        await connect();

        //3. Find the user with the email OR name in the database
        const user: any = await User.findOne({ email: email }).exec();

        //4. If the user does not exist return an error
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        } else {
            //5. If the user exists compare the password with the hashed password in the database

            //This will only work for users who registered after the password hashing was implemented
            // const isMatch = await bcrypt.compare(password, user.password);

            const isMatch = password === user.password;

            //6. If the password does not match return an error
            if (!isMatch) {
                return new NextResponse("Invalid credentials", { status: 401 });
            } else {
                //7. If the password matches return the user
                // return new NextResponse(user, { status: 200 });

                return new NextResponse("Success - you're logged in", {
                    status: 200,
                });
            }
        }
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

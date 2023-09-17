import User from "@/models/user";
import connect from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const { name, email, password } = await request.json();

    await connect();

    const hashedPassword = await bcrypt.hash(password, 2);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
    });

    try {
        //1. First check if the user already exists
        const user: any = await User.findOne({ email: email }).exec();

        //2. If the user email already exists then return an error
        if (!user) {
            await newUser.save();
            return new NextResponse("User has been created", {
                status: 200,
            });
        } else {
            return new NextResponse("User with same email already exists", {
                status: 401,
            });
        }
    } catch (err: any) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};

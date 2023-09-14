import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/user";

export const GET = async (request: any) => {
    try {
        await connect();

        const users: any = await User.find();

        return new NextResponse(users, { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

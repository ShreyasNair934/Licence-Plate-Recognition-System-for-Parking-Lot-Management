import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/user";
import { getSession } from "next-auth/react";
import { NextApiRequest } from "next";

export const GET = async (request: any) => {
    try {
        await connect();

        const selectedFields = ["name", "email", "vehicles"];

        const users: any = await User.find().select(selectedFields).exec();

        return NextResponse.json({ data: users }, { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

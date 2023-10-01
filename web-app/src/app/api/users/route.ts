import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/user";
import { getSession } from "next-auth/react";
import { NextApiRequest } from "next";

export const GET = async (request: NextApiRequest) => {
    const session = await getSession({ req: request });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    } else {
        try {
            await connect();

            const selectedFields = ["name", "email", "vehicles"];

            const users: any = await User.find().select(selectedFields).exec();

            return new NextResponse(users, { status: 200 }).json();
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    }
};

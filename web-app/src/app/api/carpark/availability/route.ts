import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Carpark_availability from "@/models/carpark_availability";
import { getSession } from "next-auth/react";

export const GET = async (request: any) => {
    const session = await getSession({ req: request });

    // if (!session) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // } else {

    // }

    try {
        await connect();

        const selectedFields = ["carpark_no", "carpark_occupied"];

        const carpark_availabilities: any = await Carpark_availability.find()
            .select(selectedFields)
            .exec();

        return NextResponse.json(
            { data: carpark_availabilities },
            { status: 200 },
        );
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Vehicle from "@/models/vehicle";
import { getSession } from "next-auth/react";

export const GET = async (request: any) => {
    const session = await getSession({ req: request });

    // if (!session) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // } else {

    // }

    try {
        await connect();

        //find vehicle where in_car_park is true
        const vehicles: any = await Vehicle.find({ in_carpark: true }).exec();

        return NextResponse.json({ vehicles: vehicles }, { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

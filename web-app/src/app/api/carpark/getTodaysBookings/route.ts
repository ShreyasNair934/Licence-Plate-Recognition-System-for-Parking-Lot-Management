import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Carpark_bookings from "@/models/carpark_bookings";
import { getSession } from "next-auth/react";
import { format } from "date-fns-tz";

export const GET = async (request: any) => {
    const session = await getSession({ req: request });

    // if (!session) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // } else {

    // }

    const isToday = (dateString: any) => {
        const perthTimeZone = "Australia/Perth";
        const nowInPerth = new Date();
        const formattedDate = format(nowInPerth, "dd/MM/yyyy", {
            timeZone: perthTimeZone,
        });

        const today = formattedDate;

        return dateString === today;
    };

    try {
        await connect();

        const selectedFields = ["timeslot", "carpark_no", "date"];

        const carpark_bookingsArr: any = await Carpark_bookings.find()
            .select(selectedFields)
            .exec();

        return NextResponse.json(
            {
                data: carpark_bookingsArr.filter((item: any) =>
                    isToday(item.date),
                ),
            },
            { status: 200 },
        );
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

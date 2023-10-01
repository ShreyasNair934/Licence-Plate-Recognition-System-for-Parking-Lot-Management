import Carpark_bookings from "@/models/carpark_bookings";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { format } from "date-fns-tz";

export const POST = async (request: any) => {
    const { timeslot, carpark_no, vehicle_no, user_email } =
        await request.json();

    await connect();

    const perthTimeZone = "Australia/Perth";
    const nowInPerth = new Date();
    const formattedDate = format(nowInPerth, "dd/MM/yyyy", {
        timeZone: perthTimeZone,
    });

    const newBooking = new Carpark_bookings({
        date: formattedDate,
        timeslot: timeslot,
        vehicle_no: vehicle_no.toUpperCase(),
        user_email: user_email,
        carpark_no: carpark_no,
    });

    try {
        await newBooking.save();
        return new NextResponse("Booking been created", {
            status: 200,
        });
    } catch (err: any) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};

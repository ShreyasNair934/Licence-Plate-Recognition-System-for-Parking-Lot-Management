import User from "@/models/user";
import connect from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const { name, email, password, numberplate } = await request.json();

    await connect();

    const hashedPassword = await bcrypt.hash(password, 2);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
        vehicles: new Array(numberplate.toUpperCase()),
    });

    try {
        //1. First check if the user already exists
        const user: any = await User.findOne({ email: email }).exec();
        const vehicleArr: any = await User.find({
            vehicles: { $in: [numberplate.toUpperCase()] },
        }).exec();

        //2. If the user email already exists then return an error
        if (!user && vehicleArr.length === 0) {
            await newUser.save();
            return new NextResponse("User has been created", {
                status: 200,
            });
        } else if (user) {
            return new NextResponse("User with same email already exists", {
                status: 401,
            });
        } else if (vehicleArr.length > 0) {
            console.log(numberplate.toUpperCase());
            return new NextResponse(
                "Another user has already registered this vehicle",
                {
                    status: 404,
                },
            );
        }

        //3. Find if user has already registered the vehicle

        //4. If the vehicle already exists then return an error
    } catch (err: any) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};

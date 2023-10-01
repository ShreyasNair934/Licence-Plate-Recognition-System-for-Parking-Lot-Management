import mongoose from "mongoose";

const { Schema } = mongoose;

const carpark_bookingsSchema = new Schema({
    date: {
        type: String,
        unique: false,
        required: true,
    },
    timeslot: {
        type: String,
        unique: false,
        required: true,
    },
    vehicle_no: {
        type: String,
        unique: false,
        required: true,
    },
    user_email: {
        type: String,
        unique: false,
        required: true,
    },
    carpark_no: {
        type: String,
        unique: false,
        required: true,
    },
});

//If the User collection does not exist create a new one.
export default mongoose.models.Carpark_bookings ||
    mongoose.model(
        "Carpark_bookings",
        carpark_bookingsSchema,
        "carpark_bookings",
    );

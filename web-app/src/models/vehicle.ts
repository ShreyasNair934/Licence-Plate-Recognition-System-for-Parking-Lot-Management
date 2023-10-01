import mongoose from "mongoose";

const { Schema } = mongoose;

const vehicleSchema = new Schema({
    vehicle_no: {
        type: String,
        unique: false,
        required: true,
    },
    entry_time: {
        type: String,
        unique: false,
        required: true,
    },
    exit_time: {
        type: String,
        unique: false,
        required: false,
    },
    in_carpark: {
        type: Boolean,
        required: true,
    },
});

//If the User collection does not exist create a new one.
export default mongoose.models.Vehicle ||
    mongoose.model("Vehicle", vehicleSchema, "vehicles");

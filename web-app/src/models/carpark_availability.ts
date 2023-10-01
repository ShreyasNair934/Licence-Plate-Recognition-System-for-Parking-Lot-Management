import mongoose from "mongoose";

const { Schema } = mongoose;

const carpark_availabilitySchema = new Schema({
    carpark_no: {
        type: String,
        unique: false,
        required: true,
    },
    carpark_occupied: {
        type: String,
        unique: false,
        required: true,
    },
    last_updated: {
        type: String,
        unique: false,
        required: false,
    },
});

//If the User collection does not exist create a new one.
export default mongoose.models.Carpark_availability ||
    mongoose.model(
        "Carpark_availability",
        carpark_availabilitySchema,
        "carpark_availability",
    );

const mongoose = require("mongoose");

module.exports = mongoose.model(
  "vehicles",
  new mongoose.Schema(
    {
      vehicle_no: String,
      entry_time: Date,
    },
    { collection: "vehicles" }
  )
);

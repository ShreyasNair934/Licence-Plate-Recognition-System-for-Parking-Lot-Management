const mongoose = require("mongoose");
const cron = require("node-cron");

mongoose.connect(
  "mongodb+srv://web_app1:R4lOYv1I99gBULYh@numberplatereader-test.d5pwtt0.mongodb.net/webapp_test",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const express = require("express");
const vehicles = require("./models/vehicle");
const sendEmail = require("./email");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const port = process.env.PORT || 5000;

app.get("/api/vehicle", async (req, res) => {
  try {
    const vehiclesList = await vehicles.find({});
    res.send(vehiclesList);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/api/vehicle", (req, res) => {
  const { vehicle_no, entry_time } = req.body;
  const newvehicles = new vehicles({
    vehicle_no,
    entry_time,
  });
  newvehicles.save((err) => {
    return err ? res.send(err) : res.send("successfully vehicle entry saved ");
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

cron.schedule("*/2 * * * *", async () => {
  console.log("Running Cron Job");

  try {
    // Get the current time
    const currentTime = new Date();

    // Fetch all vehicles from the database
    const allVehicles = await vehicles.find({});

    // Iterate through the vehicles and check if their time has expired
    for (const vehicle of allVehicles) {
      const entryTime = new Date(vehicle.entry_time);
      const timeDifferenceInMinutes = Math.floor(
        (currentTime - entryTime) / (1000 * 60)
      );

      // If time has expired (e.g., 60 minutes), send an email
      if (timeDifferenceInMinutes >= 60) {
        const to = "s221071691@deakin.edu.au";
        const subject = "Parking Timer Expired";
        const text = "Your Parking Time has Expired Please Pay the Parking Fee";

        await sendEmail(to, subject, text);
      }
    }
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});

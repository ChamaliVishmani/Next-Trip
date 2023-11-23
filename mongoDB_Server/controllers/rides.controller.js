import db from "../models/index.js";

const Ride = db.ride;

export async function addRide(req, res) {
  try {
    const newRide = new Ride({
      "Date/Time": req.body.dateTime,
      Lat: req.body.lat,
      Lon: req.body.lon,
    });

    await newRide.save();

    res.status(200).send({ message: "New ride data added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

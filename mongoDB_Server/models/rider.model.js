import { model, Schema } from "mongoose";

const Ride = model(
  "Ride",
  new Schema({
    "Date/Time": String,
    Lat: Number,
    Lon: Number,
  }),
  "rides_data"
);

export default Ride;

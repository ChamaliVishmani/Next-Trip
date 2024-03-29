import { model, Schema } from "mongoose";

const User = model(
  "User",
  new Schema({
    userName: String,
    email: String,
    password: String,
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  })
);

export default User;

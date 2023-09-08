import { secret } from "../config/auth.config.js";
import db from "../models/index.js";
const User = db.user;
const Role = db.role;

import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function signup(req, res) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    let rolesToAdd = ["user"];
    if (req.body.roles) {
      rolesToAdd = req.body.roles;
    }

    const roles = await Role.find({ name: { $in: rolesToAdd } });

    savedUser.roles = roles.map((role) => role._id);
    await savedUser.save();

    res.status(200).send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

export async function signin(req, res) {
  try {
    const user = await User.findOne({
      userName: req.body.userName,
    }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jsonwebtoken.sign({ id: user.id }, secret, {
      algorithm: "HS256",
      expiresIn: "24h", // 24 hours
    });

    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    res.status(200).send({
      id: user._id,
      userName: user.userName,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

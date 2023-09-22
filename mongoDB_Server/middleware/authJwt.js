import jsonwebtoken from "jsonwebtoken";

import { secret } from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

const checkUserRole = async (req, res, role) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      return res.status(500).send({ message: "User not found!" });
    }

    const roles = await Role.find({ _id: { $in: user.roles } }).exec();

    const isAuthorized = roles.some((r) => r.name === role);
    if (!isAuthorized) {
      return res.status(403).send({ message: `Require ${role} Role!` });
    }

    return true; // Authorized
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const isAdmin = async (req, res, next) => {
  const authorized = await checkUserRole(req, res, "admin");
  if (authorized) {
    next();
  } else {
    // User is not authorized, send a response
    res.status(403).send({ message: "Require Admin Role!" });
  }
};

const isModerator = async (req, res, next) => {
  const authorized = await checkUserRole(req, res, "moderator");
  if (authorized) {
    next();
  } else {
    // User is not authorized, send a response
    res.status(403).send({ message: "Require Moderator Role!" });
  }
};

const isUser = async (req, res, next) => {
  const authorized = await checkUserRole(req, res, "user");
  if (authorized) {
    next();
  } else {
    // User is not authorized, send a response
    res.status(403).send({ message: "Require User Role!" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isUser,
};

export default authJwt;

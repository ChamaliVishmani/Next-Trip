// import jsonwebtoken from "jsonwebtoken";
// import { secret } from "../config/auth.config.js";
// import db from "../models/index.js";
// const User = db.user;
// const Role = db.role;

// const verifyToken = (req, res, next) => {
//   let token = req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jsonwebtoken.verify(token, secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({
//         message: "Unauthorized!",
//       });
//     }
//     req.userId = decoded.id;
//     next();
//   });
// };

// const isAdmin = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };

// const isModerator = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "moderator") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Moderator Role!" });
//         return;
//       }
//     );
//   });
// };

// const authJwt = {
//   verifyToken,
//   isAdmin,
//   isModerator,
// };
// export default authJwt;

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

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};

export default authJwt;

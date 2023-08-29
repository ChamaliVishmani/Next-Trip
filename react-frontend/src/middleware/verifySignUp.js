// import db from "../models/index.js";
// const ROLES = db.ROLES;
// const User = db.user;

// const checkDuplicateUsernameOrEmail = (req, res, next) => {
//   User.findOne({
//     username: req.body.username,
//   }).exec((error, user) => {
//     if (error) {
//       res.status(500).send({ message: error });
//       return;
//     }

//     if (user) {
//       res.status(400).send({ message: "Failed! Username is already in use!" });
//       return;
//     }
//   });

//   User.findOne({
//     email: req.body.email,
//   }).exec((error, user) => {
//     if (error) {
//       res.status(500).send({ message: error });
//       return;
//     }

//     if (user) {
//       res.status(400).send({ message: "Failed! Email is already in use!" });
//       return;
//     }

//     next();
//   });
// };

// const checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         res.status(400).send({
//           message: `Failed! Role ${req.body.roles[i]} does not exist!`,
//         });
//         return;
//       }
//     }
//   }

//   next();
// };

// const verifySignUp = {
//   checkDuplicateUsernameOrEmail,
//   checkRolesExisted,
// };

// export default verifySignUp;

import db from "../models/index.js";
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({
      username: req.body.username,
    }).exec();
    if (userByUsername) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }

    const userByEmail = await User.findOne({ email: req.body.email }).exec();
    if (userByEmail) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

export default verifySignUp;

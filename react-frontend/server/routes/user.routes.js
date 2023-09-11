// import { Route, Redirect } from "react-router-dom";

import authJwt from "../middleware/authJwt.js";
import {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} from "../controllers/user.controller.js";

export default function setupUserRoutes(app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/login", allAccess);

  app.get("/api/driverBoard", [authJwt.verifyToken, authJwt.isUser], userBoard);

  app.get(
    "/api/riderBoard",
    [authJwt.verifyToken, authJwt.isModerator],
    moderatorBoard
  );

  app.get(
    "/api/advancedBoard",
    [authJwt.verifyToken, authJwt.isAdmin],
    adminBoard
  );
}

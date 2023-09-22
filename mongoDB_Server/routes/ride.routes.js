import { addRide } from "../controllers/rides.controller.js";

export default function setupRidesRoutes(app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/rides/add", addRide);
}

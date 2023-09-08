import { DB_URL } from "./config/db.config.js";
import express, { json, urlencoded } from "express";
import cors from "cors";
import db from "./models/index.js";
import setupAuthRoutes from "./routes/auth.routes.js";
import setupUserRoutes from "./routes/user.routes.js";

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

const Role = db.role;

db.mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    initial();
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB Atlas", error);
    process.exit();
  });

// parse requests of content-type - application/json
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to next trip  application." });
});

setupAuthRoutes(app);
setupUserRoutes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      await Promise.all([
        new Role({
          name: "user",
        }).save(),

        new Role({
          name: "moderator",
        }).save(),

        new Role({
          name: "admin",
        }).save(),
      ]);

      console.log("Roles collection initialized with default roles.");
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
}

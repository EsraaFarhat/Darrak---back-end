const mongoose = require("mongoose");
const express = require("express");
const winston = require("winston");
const cors = require("cors");

require("dotenv/config");
require("express-async-errors");

const auth = require("./routes/auth");
const users = require("./routes/users");
const advertisements = require("./routes/advertisements");
const laundries = require("./routes/laundries");
const restaurants = require("./routes/restaurants");
const craftmen = require("./routes/craftmen");
const craftManRatings = require("./routes/craftManRatings");

const favourites = require("./routes/favourites");

const user_verification = require('./routes/user_verification');

const error = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/advertisements", advertisements);
app.use("/api/laundries", laundries);
app.use("/api/restaurants", restaurants);
app.use("/api/craftmen", craftmen);
app.use("/api/craftmen/rating", craftManRatings);

app.use("/api/favourites", favourites);

app.use('/api/verify', user_verification);

app.use(error);

//* Handel uncaught exceptions
winston.exceptions.handle(
  new winston.transports.Console({ colorize: true, prettyPrint: true }),
  new winston.transports.File({ filename: "logFile.log" })
);

// * Handel unhandled rejections
process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.add(
  new winston.transports.Console({ colorize: true, prettyPrint: true })
);
winston.add(new winston.transports.File({ filename: "logFile.log" }));

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection is ready... ");
  })
  .catch((err) => {
    console.log(err);
    console.log("---> Database Connection is not ready <---");
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const mongoose = require('mongoose');
const express = require('express');
const winston = require("winston");
const cors = require("cors");
require("express-async-errors");

const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", users);
app.use("/api/auth", auth);
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

  winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
  winston.add(new winston.transports.File({ filename: "logFile.log" }));

mongoose.connect('mongodb://localhost/Darrak', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => winston.info("connected to MongoDB..."))
.catch(err => winston.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(3000, ()=> {
    winston.info(`listening on port ${port}...`);
});

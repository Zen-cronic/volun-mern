require('dotenv').config()
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const credentials = require("../middleware/credentials");
const verifyJWT = require("../middleware/verifyJWT");
const {errorHandler} = require("../middleware/errorHandlerMiddleware");

const corsOptions = require("./corsOptions");


const createServer = () => {

  const app = express();

  app.use(express.json());
  app.use(credentials);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.use("/auth", require("../routes/authRoutes"));
  app.use("/refresh", require("../routes/refreshRoute"));
  app.use("/logout", require("../routes/logoutRoute"));
  app.use("/register", require("../routes/registerRoute"));

  app.use("/events", require("../routes/eventsRoutes"));

  app.use(verifyJWT);
  app.use("/users", require("../routes/usersRoutes"));

  app.use(errorHandler);

  return app
};

module.exports = { createServer };

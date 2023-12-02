const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    
    const allowedCondition =
      (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
        ? (allowedOrigins.indexOf(origin) !== -1 || !origin)
        : (allowedOrigins.indexOf(origin) !== -1);

    if (allowedCondition) {
      //callback(err, origin (non-fx val))
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;

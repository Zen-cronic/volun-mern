const mongoose = require("mongoose");

const connectDB = () => {

  const dbUri =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI

    // console.log("dbUri: ", dbUri);
  try {

    mongoose.connect(dbUri).then(() => {
      console.log("DB connected");
    //   console.log("DB name: ", mongoose.connection.name);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;

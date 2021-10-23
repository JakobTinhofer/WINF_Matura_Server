const mongoose = require("mongoose");

const MONGO_URI = "mongodb://" + (process.env["MONGO_IP"] ?? "localhost:27017") + "/winf_web_server";
console.log("Tying to connect to mongo db @ " + MONGO_URI + "...");
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to database.");
  })
  .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });
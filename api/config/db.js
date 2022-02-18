const {ConnectionString, parseHost} = require('connection-string');
const mongoose = require("mongoose");


const cs = new ConnectionString('mongodb://' + (process.env["MONGO_IP"] ?? "localhost:27017"), {
    user: process.env["DB_USER"],
    password: process.env["DB_PW"],
    path: ['winf_web_server'],
    
});

console.log("Tying to connect to mongo db @ " + cs.toString() + "...");
mongoose
  .connect(cs.toString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to database.");
  })
  .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });


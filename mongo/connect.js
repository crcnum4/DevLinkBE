const mongoose = require("mongoose");

module.exports = (uri) => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  mongoose.connection.on("open", () => {
    console.log("connected to Database");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`\nMONGO ERROR: ${err}\n`);
  });

  mongoose.connection.on("connected", () => {
    console.log("\nConnecting to Database\n");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("\nThe Application has been disconnected from the database;\n");
  });
};

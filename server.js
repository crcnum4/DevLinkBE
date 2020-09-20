require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./mongo/connect");
const app = express();
const dbURI = process.env.MONGO;
const path = require("path");

app.use(cors());

if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use(express.json());
//app.use(express.static('client/build"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/likes", require("./routes/api/likes"));

//app.use('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')));

connectDB(dbURI);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

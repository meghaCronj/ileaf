require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const rootPath = path.resolve(`${__dirname}/../`);
console.log("rootPath", rootPath);

const port = 5007 || process.env.PORT;
app.use(bodyParser.json({ limit: "500mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(express.json());

const point = path.join(__dirname);
app.use(express.json());
const whitelist = ["http://localhost:3000"];

app.use(passport.initialize());
// require("./routes")(app);

app.all("/*", function (req, res) {
  res.sendFile(path.resolve(path.join(__dirname, "")));
});
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(async (res) => {
    const server = app.listen(port, () =>
      console.log(`Server running at ${port}`)
    );
    console.log("Database Connected");
  });

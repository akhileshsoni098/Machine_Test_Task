const express = require("express");
const { connectDb } = require("./config/db");

const app = express();

app.use(express.json());

connectDb();

app.get("/", async (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: "App is working awesome" });
});

const userRoute = require("./routes/user.route");

app.use("/user", userRoute);

module.exports = app;

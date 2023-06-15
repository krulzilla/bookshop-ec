require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

// Config libs
mongoose.set("strictQuery", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Db
const connectDb = require("./src/config/connectDB.config");
connectDb();

// Routes
const routes = require("./src/routes");
app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is starting at port ${port}`);
})
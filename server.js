require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');

// Config libs
app.use(helmet());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layouts/master_layout');
app.use(cookieParser());
mongoose.set("strictQuery", true);
app.set('views', path.join(__dirname, '/src/views'));
app.use('/public' , express.static(path.join(__dirname, '/src/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Db
const connectDb = require("./src/config/connectDB.config");
connectDb();

// Routes
const routes = require("./src/routes");
app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
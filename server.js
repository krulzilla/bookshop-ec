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
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "default-src": ["'self'",
                "https://www.paypal.com",
                "https://www.sandbox.paypal.com"
            ],
            "img-src": ["'self'",
                "https://www.paypalobjects.com",
                "data:",
                "http://www.w3.org/2000/svg"
            ],
            "script-src": ["'self'", "'unsafe-inline'",
                "https://www.paypal.com",
                "https://www.sandbox.paypal.com",
            ],
        },
    },
}));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layouts/master_layout');
app.use(cookieParser());
mongoose.set("strictQuery", true);
app.set('views', path.join(__dirname, '/src/views'));
app.use('/public' , express.static(path.join(__dirname, '/src/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config passport
require("./src/controllers/auth/strategies/index");

// Connect Db
const connectDb = require("./src/config/connectDB.config");
connectDb();

// Routes
const routes = require("./src/routes");
app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
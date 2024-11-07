require("dotenv").config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const checkForAuthenticationCookie = require('./middlewares/authentication');
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch((error) => console.error("DB connection error:", error));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));


// User routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Home route
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}); 
    res.render("home", {
        user: req.user,  // Pass user data or null if not authenticated
        blogs: allBlogs
    });
});

// Start server
app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));

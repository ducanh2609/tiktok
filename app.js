const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
// const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sessionStore } = require('./utils/db.js')

var upload = multer();
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());
app.use(express.static("public"));
app.use(cookieParser());
// app.use(morgan());

app.set('view engine', 'ejs');
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'secret-code',
    store: sessionStore,
    cookie: {
        secure: false,
        // maxAge: 6000
    }
}));





const userRouters = require("./routes/users.routes.js");
app.use('/', userRouters);
const authRouters = require("./routes/auth.routes.js");
app.use('/', authRouters);
const commentRouters = require("./routes/comment.routes.js");
app.use('/', commentRouters);
const likeFollowBlogRouters = require("./routes/blog_like_follow.routes.js");
app.use('/', likeFollowBlogRouters);
const profileRouters = require("./routes/profile.routes.js");
app.use('/', profileRouters);


app.listen(3000);
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
// const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sessionStore } = require('./utils/db.js')

const { postComment, getSocket } = require('./controllers/comment.controllers.js');


var upload = multer();
const app = express();


const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.sockets.on('connection', (socket) => {
    console.log('a user connected');
    // console.log(socket.id);


})





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


app.get('/socket', getSocket);
app.post('/api/v1/comment', async (req, res) => {
    let comment = await postComment(req, res);
    // console.log(comment);
    io.sockets.emit('comment', comment);
    res.json({ message: 'Comment successfully' })
})


http.listen(3000);
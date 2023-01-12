const { findAllUser } = require('../models/models.js');
const { getAllUser, getAllBlog, getBlogLike, getCountBlogLike } = require('../controllers/controllers.js');
const { getCountComment } = require('../controllers/comment.controllers.js');

// const jwt = require('jsonwebtoken');




module.exports.checkExitsUser = async (req, res, next) => {
    let { id } = req.params
    let [record] = await findAllUser()
    switch (req.method) {
        case "POST":
            let user = record.find(item => item.username == req.body.username);
            if (user == undefined) next()
            else res.json({ message: "User already exists" });
            break;
        default:
            if (req.params.id != undefined) {
                var check = record.find(item => item.user_id == id);
                if (check != undefined) next()
                else res.json({ message: "User not found" });
                break;
            }
    }
}
module.exports.checkExitsUserLogin = async (req, res, next) => {
    let [record] = await findAllUser()
    let user = record.find(item => item.username == req.body.username && item.password == req.body.password);
    if (user != undefined) {
        req.user_id = user.user_id;
        next();
    } else res.json({ message: "User not found" });
}



module.exports.checkExitsLogin = async (req, res, next) => {
    let { userId } = req.session;
    let [record] = await findAllUser();
    let user = record.find(item => item.user_id == userId);
    if (user) next()
    else res.json({ message: "Acount doesn't exists" });
}

module.exports.isAuth = async (req, res, next) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let blog = await getAllBlog();
    let blogLike = await getBlogLike();
    let countLike = await getCountBlogLike();
    let countValue = countLike.reduce((arr, item) => {
        arr.push(item.blog_id)
        return arr
    }, [])
    let totalComment = await getCountComment();
    if (userId) next()
    else res.render('home', {
        user: { username: undefined, follow: [] },
        allUsers: record,
        blog: blog,
        allLike: blogLike,
        like: [countLike, countValue],
        totalComment: totalComment
    })
}

module.exports.isAdmin = async (req, res, next) => {
    let { username } = req.cookies;
    let user = jwt.verify(username, 'token');
    let record = await getAllUser();
    let data = record.find(item => item.username = user.username);
    if (data.role == 'admin') next()
}
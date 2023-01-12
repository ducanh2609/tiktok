const express = require('express');
const router = express.Router();
const { getAllUser, postBlog, getAllBlog, getOneFollow, getCountBlogLike, getBlogLike } = require('../controllers/controllers.js');
const { getCountComment } = require('../controllers/comment.controllers.js');
const { checkExitsUser, isAuth } = require('../middlewares/middlewares.js');
const jwt = require('jsonwebtoken');

router.get('/', isAuth, async (req, res) => {
    let { username } = req.cookies;
    let record = await getAllUser();
    let blog = await getAllBlog();
    let token = jwt.verify(username, 'token');
    let user = record.find(item => item.username == token.username);
    let blogLike = await getBlogLike();
    let countLike = await getCountBlogLike();
    let countValue = countLike.reduce((arr, item) => {
        arr.push(item.blog_id)
        return arr
    }, [])
    let follow = await getOneFollow(user.user_id);
    user.follow = follow;
    blog.forEach((e) => {
        converTimePart(e)
    })
    let totalComment = await getCountComment();
    res.render('home', {
        allUsers: record,
        user: user,
        blog: blog,
        like: [countLike, countValue],
        allLike: blogLike,
        totalComment: totalComment
    })
})
router.get('/following', isAuth, async (req, res) => {
    let { username } = req.cookies;
    let record = await getAllUser();
    let blog = await getAllBlog();
    let token = jwt.verify(username, 'token');
    let user = record.find(item => item.username == token.username);
    let follow = await getOneFollow(user.user_id);
    user.follow = follow;
    res.render('following', {
        allUsers: record,
        user: user,
        blog: blog
    })

})


router.get('/upfile', isAuth, async (req, res) => {
    let { username } = req.cookies;
    let token = jwt.verify(username, 'token');
    let record = await getAllUser();
    let user = record.find(item => item.username == token.username);
    res.render('upfile', {
        user: user
    })
})

router.get('/chat', isAuth, async (req, res) => {
    let { username } = req.cookies;
    let token = jwt.verify(username, 'token');
    let record = await getAllUser();
    let user = record.find(item => item.username == token.username);
    res.render('chat', {
        user: user
    })
})



router.post('/api/v1/blog', postBlog)



function converTimePart(param) {
    let newTime = param.time.getTime();
    let currentTime = new Date().getTime();
    let hieu = currentTime - newTime;
    let min = ((hieu / 1000) / 60).toFixed(0);
    let hour = (min / 60).toFixed(0);
    let day = (hour / 24).toFixed(0);
    let week = (day / 7).toFixed(0);
    let month = (week / 4).toFixed(0);
    let year = (month / 12).toFixed(0);
    if (year >= 2) {
        param.time = 'vài năm trước';
    } else if (year >= 1) {
        param.time = 'khoảng 1 năm trước';
    } else if (month >= 6) {
        param.time = 'khoảng hơn nửa năm trước';
    } else if (month >= 2) {
        param.time = 'khoảng vài tháng trước';
    } else if (month >= 1) {
        param.time = 'khoảng 1 tháng trước';
    } else if (week >= 2) {
        param.time = 'khoảng nửa tháng trước';
    } else if (week >= 1) {
        param.time = 'khoảng 1 tuần trước';
    } else if (day >= 2) {
        param.time = 'khoảng vài ngày trước';
    } else if (day >= 1) {
        param.time = 'khoảng 1 ngày trước';
    } else if (hour >= 6) {
        param.time = 'khoảng hơn nửa ngày trước';
    } else if (hour >= 1) {
        param.time = 'khoảng 1 giờ trước';
    } else if (min >= 30) {
        param.time = 'khoảng hơn 30 phút trước';
    } else if (min >= 2) {
        param.time = 'khoảng vài phút trước';
    } else if (min >= 1) {
        param.time = 'khoảng 1 phút trước';
    } else if (min < 1) {
        param.time = 'khoảng vài giây trước';
    }
}
function convertTime(param) {
    let newTime = param.time.toLocaleDateString().split("/")
    let temp = newTime[0]
    newTime[0] = newTime[1]
    newTime[1] = temp;
    newTime = newTime.join("/");
    let hour = param.time.toLocaleTimeString()
    param.time = newTime;
    param.hour = hour;
}

module.exports = router
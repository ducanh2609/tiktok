const express = require('express');
const router = express.Router();
const { getAllUser, getAllBlog, getOneFollow } = require('../controllers/controllers.js');
const { postComment, getComment, getSocket } = require('../controllers/comment.controllers.js');
const { checkExitsUser, checkExitsLogin, isAuth } = require('../middlewares/middlewares.js');




router.get('/comment/:id/:content', checkExitsLogin, async (req, res) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let user = record.find(item => item.user_id == userId);
    let follow = await getOneFollow(user.user_id);
    user.follow = follow;
    let allBlog = await getAllBlog();
    let blog = allBlog.find(item => item.blog_id == req.params.id)
    blog.hour = blog.time.toLocaleTimeString();
    converTimePart(blog);
    // console.log(blog);
    let comment = await getComment(req.params.id)
    comment.forEach((item) => {
        converTimePart(item)
    })
    res.render('comment', {
        blog: blog,
        allBlog: allBlog.length,
        user: user,
        comment: comment
    })
})
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
    } else if ((hieu / 1000) >= 30) {
        param.time = 'khoảng nửa phút trước';
    } else {
        param.time = 'Vừa xong';
    }
}

module.exports = router

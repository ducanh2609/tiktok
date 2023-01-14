const express = require('express');
const router = express.Router();
const { getAllUser, getAllBlog, putImage, getOneFollow, getUserFollow, getFollowUser } = require('../controllers/controllers.js');
const { getOneLike } = require('../controllers/blog_like_follow.controllers.js');
const { checkExitsUser, checkExitsLogin, isAuth } = require('../middlewares/middlewares.js');
// const jwt = require('jsonwebtoken');


router.get('/profile/@:TikTokID', isAuth, checkExitsLogin, async (req, res) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let user = record.find(item => item.tiktok_id == req.params.TikTokID);
    let userCurrent = record.find(item => item.user_id == userId);
    // Tất cả bài viết và tìm những bài viết của người dùng thứ id
    let blogAll = await getAllBlog();
    let blog = blogAll.reduce((arr, item) => {
        if (item.user_id == user.user_id) {
            arr.push(item)
        }
        return arr
    }, [])
    // Tìm các lượt follow và đc follow của người dùng thứ id
    let follow = await getUserFollow();
    let findFollow = follow.find(item => item.user_follow == user.user_id);
    let follower = await getFollowUser();
    let findFollower = follower.find(item => item.user_follower == user.user_id);
    let following = await getOneFollow(userCurrent.user_id);
    userCurrent.follow = following;

    // Tìm tất cả các lượt thích của người dùng thứ id
    let oneLike = await getOneLike(user.user_id)
    user.countLike = oneLike.length;
    // console.log(oneLike);
    res.render('profile', {
        allUsers: record,
        user: user,
        blog: blog,
        follow: findFollow,
        follower: findFollower,
        oneLike: oneLike,
        userCurrent: userCurrent
    })
})












router.put('/profile/@:TikTokID', putImage)

module.exports = router

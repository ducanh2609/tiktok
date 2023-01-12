const express = require('express');
const router = express.Router();
const { getAllUser, getAllBlog, putImage, getOneFollow, getUserFollow, getFollowUser } = require('../controllers/controllers.js');
const { getOneLike } = require('../controllers/blog_like_follow.controllers.js');
const { checkExitsUser, checkExitsLogin, isAuth } = require('../middlewares/middlewares.js');
const jwt = require('jsonwebtoken');

router.get('/profile/:id', isAuth, checkExitsUser, async (req, res) => {
    let { username } = req.cookies;
    let token = jwt.verify(username, 'token');
    let record = await getAllUser();
    let user = record.find(item => item.username == token.username);
    // Tất cả bài viết và tìm những bài viết của người dùng thứ id
    let blogAll = await getAllBlog();
    let blog = blogAll.reduce((arr, item) => {
        if (item.username == token.username) {
            arr.push(item)
        }
        return arr
    }, [])
    // Tìm các lượt follow và đc follow của người dùng thứ id
    let follow = await getUserFollow();
    let findFollow = follow.find(item => item.user_follow == user.user_id);
    let follower = await getFollowUser();
    let findFollower = follower.find(item => item.user_follower == user.user_id);
    let following = await getOneFollow(user.user_id);
    user.follow = following;
    // Tìm tất cả các lượt thích của người dùng thứ id
    let oneLike = await getOneLike(req.params.id)
    user.countLike = oneLike.length;
    // console.log(oneLike);
    res.render('profile', {
        allUsers: record,
        user: user,
        blog: blog,
        follow: findFollow,
        follower: findFollower,
        oneLike: oneLike
    })
})
router.put('/profile/:id', putImage)

module.exports = router

const express = require('express');
const router = express.Router();
const { getAllUser, postBlog, getAllBlog, getOneFollow, getCountBlogLike, getBlogLike, getChat } = require('../controllers/controllers.js');
const { getCountComment } = require('../controllers/comment.controllers.js');
const { checkExitsUser, checkExitsLogin, isAuth } = require('../middlewares/middlewares.js');
// const jwt = require('jsonwebtoken');

router.get('/', isAuth, checkExitsLogin, async (req, res) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let blog = await getAllBlog();
    let user = record.find(item => item.user_id == userId);
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
router.get('/following', isAuth, checkExitsLogin, async (req, res) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let blog = await getAllBlog();
    let user = record.find(item => item.user_id == userId);
    let follow = await getOneFollow(user.user_id);
    user.follow = follow;
    res.render('following', {
        allUsers: record,
        user: user,
        blog: blog
    })

})


router.get('/upfile', isAuth, checkExitsLogin, async (req, res) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let user = record.find(item => item.user_id == userId);
    res.render('upfile', {
        user: user
    })
})

router.get('/chat/:tiktokID', isAuth, checkExitsLogin, async (req, res) => {
    let { userId } = req.session;
    let record = await getAllUser();
    let user = record.find(item => item.user_id == userId);
    if (user.tiktok_id == req.params.tiktokID) {
        let follow = await getOneFollow(user.user_id);
        user.follow = follow;
        let record = await getAllUser();
        let allFollowUser = record.reduce((arr, item) => {
            if (follow.indexOf(item.user_id) != -1) {
                arr.push(item)
            }
            return arr
        }, []);
        res.render('chat', {
            user: user,
            allFollowUser: allFollowUser,
            allUsers: record
        })
    } else {
        res.redirect('/')
    }
})

router.get('/api/v1/chat/:id1/:id2', isAuth, checkExitsLogin, getChat)




router.post('/api/v1/blog', postBlog)


router.get('/api/v1/search', async (req, res) => {
    let user = await getAllUser();
    let ticktokID = user.reduce((arr, item) => {
        arr.push(item.tiktok_id);
        return arr;
    }, [])
    res.json({
        data: user,
        ticktokID: ticktokID
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
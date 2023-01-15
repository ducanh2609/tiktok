const { findAllUser, postUserSQL, findAllBlog, postBlogSQL, putImageSQL, findOneFollow, findUserFollow, findFollowUser, findCountBlogLike, findBlogLike, findChat, findImageUserChat, postChatSQL } = require('../models/models.js');
const jwt = require('jsonwebtoken');


module.exports.postUser = async (req, res) => {
    let [data] = await findAllUser();
    console.log(data);
    let { username, email, password } = req.body;
    let arr = [data.length + 1, username, email, password, data.length + 1, null, null, null, null];
    await postUserSQL(arr);
    res.json({ message: 'Acount create successfully' })
}

module.exports.getAllUser = async (req, res) => {
    let [record] = await findAllUser()
    return record;
}
module.exports.postBlog = async (req, res) => {
    let [data] = await findAllBlog();
    let blogID = data.reduce((arr, item) => {
        arr.push(item.blog_id);
        return arr;
    }, [])
    let blogMax = 0;
    if (blogID.length != 0) {
        blogMax = +blogID.reduce((acc, val) => (acc > val) ? acc : val);
    }
    let { user_id, url, status, image_blog, like, share, provide, comment, duet, stitch } = req.body;
    let arr = [blogMax + 1, user_id, url, status, image_blog, provide, comment, duet, stitch, ""];
    await postBlogSQL(arr);
    res.json({ message: 'Create successfully' })
}

module.exports.getAllBlog = async (req, res) => {
    let [record] = await findAllBlog()
    return record;
}

module.exports.putImage = async (req, res) => {
    let data = req.body;
    let arr = [data.image, data.tiktokid, data.name, data.story, req.params.TikTokID]
    await putImageSQL(arr);
    res.json({
        message: 'Update successfully',
        href: data.tiktokid
    })
}
module.exports.getOneFollow = async (id) => {
    let [record] = await findOneFollow(id)
    let arrFollow = record.reduce((arr, item) => {
        arr.push(item['user_follower']);
        return arr;
    }, [])
    return arrFollow;
}

module.exports.getUserFollow = async (req, res) => {
    let [record] = await findUserFollow();
    return record;
}
module.exports.getFollowUser = async (req, res) => {
    let [record] = await findFollowUser();
    return record;
}
module.exports.getCountBlogLike = async (req, res) => {
    let [record] = await findCountBlogLike();
    return record;
}
module.exports.getBlogLike = async (req, res) => {
    let [record] = await findBlogLike();
    return record;
}
module.exports.getChat = async (req, res) => {
    let [chat] = await findChat(req.params.id1, req.params.id2);
    let [Image] = await findImageUserChat(req.params.id1, req.params.id2)
    chat.forEach((item) => {
        converTimePart(item)
    })
    res.send({
        chat: chat,
        image: Image
    })
}
module.exports.postChat = async (req, res) => {
    // Post data to SQL
    // console.log(req.body);
    let [count] = await findChat();
    let total = 0;
    if (count.length != 0) {
        total = +count.length;
    }
    let arr = [total + 1, ...Object.values(req.body)];
    await postChatSQL(arr);
    // Push socket
    let [Image] = await findImageUserChat(req.body.userSend, req.body.userReceive);
    let [allChat] = await findChat();
    let data = allChat[total];
    data.imageSend = Image.find(item => item.user_id == req.body.userSend).image;
    data.imageReceive = Image.find(item => item.user_id == req.body.userReceive).image;
    let chat = [];
    // let comment = [];
    converTimePart(data);
    chat.push(data);
    return chat
}




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
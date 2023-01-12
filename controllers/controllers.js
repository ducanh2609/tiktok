const { findAllUser, postUserSQL, findAllBlog, postBlogSQL, putImageSQL, findOneFollow, findUserFollow, findFollowUser, findCountBlogLike, findBlogLike } = require('../models/models.js');
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
    let { username } = req.cookies;
    let token = jwt.verify(username, 'token');
    console.log(token);
    let [record] = await findAllUser();
    console.log(record);
    let user = record.find(item => item.username == token.username);
    console.log(user);
    let [data] = await findAllBlog();
    let { url, status, like, share, provide, comment, duet, stitch } = req.body;
    let arr = [data.length + 1, user.user_id, url, status, like, share, ""];
    console.log(arr);
    await postBlogSQL(arr);
    res.json({ message: 'Create successfully' })
}

module.exports.getAllBlog = async (req, res) => {
    let [record] = await findAllBlog()
    return record;
}

module.exports.putImage = async (req, res) => {
    let data = req.body
    let arr = [data.image, data.tiktokid, data.name, data.story, req.params.id]
    await putImageSQL(arr);
    res.json({ message: 'Update successfully' })
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


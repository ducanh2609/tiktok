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


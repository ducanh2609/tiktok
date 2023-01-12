const { postFollowSQL, deleteFollowSQL, postBlogLikeSQL, deleteBlogLikeSQL, findOneLike } = require('../models/blog_like_follow.models.js');
const jwt = require('jsonwebtoken');

module.exports.postFollow = async (req, res) => {
    let arr = [req.body.follow, req.body.follower];
    await postFollowSQL(arr);
    res.json({ message: 'Create successfully' })

}
module.exports.deleteFollow = async (req, res) => {
    let arr = [+req.body.follow, +req.body.follower];
    await deleteFollowSQL(arr);
    res.json({ message: 'Delete successfully' })

}





module.exports.postBlogLike = async (req, res) => {
    let arr = [req.body.user_id, req.body.blog_id];
    await postBlogLikeSQL(arr);
    res.json({ message: 'Like successfully' })
}
module.exports.deleteBlogLike = async (req, res) => {
    let arr = [req.body.user_id, req.body.blog_id];
    await deleteBlogLikeSQL(arr);
    res.json({ message: 'Delete successfully' })
}
module.exports.getOneLike = async (id) => {
    let [record] = await findOneLike(id);
    return record;
}
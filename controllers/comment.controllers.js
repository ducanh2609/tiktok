const { postCommentSQL, findComment, findCountComment } = require('../models/comment.models.js');
const jwt = require('jsonwebtoken');

module.exports.postComment = async (req, res) => {
    let [count] = await findComment();
    let total = 0;
    if (count.length != 0) {
        total = +count.length;
    }
    let arr = [total + 1, ...Object.values(req.body)];
    await postCommentSQL(arr);
    res.json({ message: 'Comment successfully' })
}
module.exports.getComment = async (id) => {
    let [record] = await findComment(id);
    return record;
}
module.exports.getCountComment = async () => {
    let [record] = await findCountComment();
    return record;
}
const { postCommentSQL, findComment, findCountComment, getDatatoSocket } = require('../models/comment.models.js');
// const jwt = require('jsonwebtoken');


module.exports.postComment = async (req, res) => {

    // Post data to SQL
    // console.log(req.body);
    let [count] = await findComment();
    let total = 0;
    if (count.length != 0) {
        total = +count.length;
    }
    let arr = [total + 1, ...Object.values(req.body)];
    await postCommentSQL(arr);
    // Push socket
    let [commentID] = await findComment();
    let [data] = await getDatatoSocket(commentID.length);
    let comment = [];
    converTimePart(data[0]);
    comment.push(data[0]);
    return comment
}
module.exports.getComment = async (id) => {

    let [record] = await findComment(id);
    return record;
}
module.exports.getCountComment = async () => {
    let [record] = await findCountComment();
    return record;
}
module.exports.getSocket = async (req, res) => {
    res.send(comment)
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


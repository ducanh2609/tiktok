const db = require('../utils/db.js');


module.exports.postFollowSQL = (arr) => {
    let sql = `INSERT INTO follow VALUES(?,?,default) ;`
    return db.query(sql, arr)
}
module.exports.deleteFollowSQL = (arr) => {
    let sql = 'DELETE FROM follow WHERE (user_follow = ? AND user_follower = ?)'
    return db.query(sql, arr)
}




module.exports.postBlogLikeSQL = (arr) => {
    let sql = `INSERT INTO tb_like VALUES(?,?,default)`;
    return db.query(sql, arr)
}
module.exports.deleteBlogLikeSQL = (arr) => {
    let sql = `DELETE FROM tb_like WHERE user_id = ? AND blog_id = ?`;
    return db.query(sql, arr)
}
module.exports.findOneLike = (id) => {
    let sql = `SELECT t1.user_id, t1.blog_id, t1.time, t2.url, t2.status  FROM tb_like AS t1, blogs AS t2 
    WHERE t1.user_id = ? AND t1.blog_id = t2.blog_id`;
    return db.query(sql, id)
}
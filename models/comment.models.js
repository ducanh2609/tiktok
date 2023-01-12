const db = require('../utils/db.js');

module.exports.postCommentSQL = (arr) => {
    let sql = `INSERT INTO comment VALUES(?,?,?,?,?,default)`;
    return db.query(sql, arr)
}
module.exports.findComment = (id) => {
    let sql = `SELECT t1.username, t3.image, t2.user_id, t2.content, t2.time FROM users AS t1, comment AS t2, user_profile AS t3
    WHERE t1.user_id = t2.user_id AND t3.user_id = t2.user_id AND t2.blog_id = ?
    ORDER BY t2.time DESC`;
    return db.query(sql, id)
}
module.exports.findCountComment = () => {
    let sql = `SELECT t1.blog_id, count(t1.comment_id) AS count FROM comment AS t1
    GROUP BY t1.blog_id`;
    return db.query(sql)
}
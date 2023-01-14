const { db } = require('../utils/db.js');


module.exports.postCommentSQL = (arr) => {
    let sql = `INSERT INTO comment VALUES(?,?,?,?,?,default)`;
    return db.query(sql, arr)
}
module.exports.findComment = (id) => {
    if (id) {
        let sql = `SELECT t1.username, t3.image, t3.tiktok_id, t2.user_id, t2.content, t2.time FROM users AS t1, comment AS t2, user_profile AS t3
        WHERE t1.user_id = t2.user_id AND t3.user_id = t2.user_id AND t2.blog_id = ?
        ORDER BY t2.time ASC`;
        return db.query(sql, id)
    } else {
        let sql = `SELECT * FROM comment`;
        return db.query(sql)
    }
}
module.exports.findCountComment = () => {
    let sql = `SELECT t1.blog_id, count(t1.comment_id) AS count FROM comment AS t1
    GROUP BY t1.blog_id`;
    return db.query(sql)
}
module.exports.getDatatoSocket = (index) => {
    let sql = `SELECT t1.blog_id, t1.content, t1.time, t1.like, t2.tiktok_id, t2.image FROM comment AS t1, user_profile AS t2
    WHERE t1.user_id = t2.user_id AND t1.comment_id = ?`;
    return db.query(sql, [index])
}
const db = require('../utils/db.js');

module.exports.findAllUser = () => {
    let sql = `SELECT t1.user_id, t1.username, t1.email, t1.password, t2.name, t2.tiktok_id, t2.image, t2.story FROM tick_tok.users AS t1, tick_tok.user_profile AS t2
    WHERE t1.user_id = t2.user_id`;
    return db.execute(sql)
}

module.exports.postUserSQL = (arr) => {
    let sql = `INSERT INTO users VALUES(?,?,?,?); INSERT INTO user_profile VALUES(?,?,?,?,?)`;
    return db.query(sql, arr)
}

module.exports.findAllBlog = () => {
    let sql = `SELECT t1.blog_id, t1.user_id, t1.url, t1.status, t1.time, t2.username, t3.name, t3.image, t3.tiktok_id
    FROM blogs AS t1, users AS t2, user_profile as t3
    WHERE t1.user_id = t2.user_id AND t2.user_id = t3.user_id` ;
    return db.execute(sql)
}
module.exports.postBlogSQL = (arr) => {
    let sql = `INSERT INTO blogs VALUES(1,?,?,?,default)`;
    return db.query(sql, arr)
}

module.exports.putImageSQL = (arr) => {
    let sql = `UPDATE user_profile SET image= ?, tiktok_id = ?, name = ?, story = ? WHERE user_id = ?`;
    return db.query(sql, arr)
}
module.exports.findOneFollow = (id) => {
    let sql = `SELECT t1.user_follower FROM follow AS t1 WHERE user_follow = ? ;`
    return db.query(sql, id)
}

module.exports.findUserFollow = () => {
    let sql = 'SELECT user_follow, count(user_follower) as follow FROM follow GROUP BY user_follow';
    return db.query(sql)
}
module.exports.findFollowUser = () => {
    let sql = 'SELECT user_follower, count(user_follow) as follower FROM follow GROUP BY user_follower';
    return db.query(sql)
}
module.exports.findCountBlogLike = () => {
    let sql = `SELECT t1.blog_id, count(t1.user_id) AS 'like'
    FROM tb_like as t1
    GROUP BY t1.blog_id` ;
    return db.execute(sql)
}
module.exports.findBlogLike = () => {
    let sql = `SELECT * FROM tb_like`;
    return db.execute(sql)
}


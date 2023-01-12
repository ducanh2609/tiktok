const express = require('express');
const router = express.Router();
const { postUser, getAllUser, postBlog, getAllBlog, putImage } = require('../controllers/controllers.js');
const { checkExitsUser, checkExitsLogin, isAuth, isAdmin } = require('../middlewares/middlewares.js');
const jwt = require('jsonwebtoken');

router.post('/api/v1/signin', checkExitsUser, postUser)

router.get('/signin', (req, res) => {
    res.render('signin')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/api/v1/login', checkExitsLogin, async (req, res) => {
    let data = await getAllUser();
    let user = data.find(item => item.username == req.body.username);
    let token = jwt.sign(user, 'token');
    res.json({ message: token });
})



module.exports = router

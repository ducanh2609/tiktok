const express = require('express');
const router = express.Router();
const { postUser, getAllUser, postBlog, getAllBlog, putImage } = require('../controllers/controllers.js');
const { checkExitsUser, checkExitsUserLogin, checkExitsLogin, isAuth, isAdmin } = require('../middlewares/middlewares.js');
const jwt = require('jsonwebtoken');

router.post('/api/v1/signin', checkExitsUser, postUser)

router.get('/signin', (req, res) => {
    res.render('signin')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/api/v1/login', checkExitsUserLogin, async (req, res) => {
    req.session.userId = req.user_id;
    res.json({ message: 'Login successfully' })
})
router.get('/api/v1/logout', async (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successfully' })
})


module.exports = router

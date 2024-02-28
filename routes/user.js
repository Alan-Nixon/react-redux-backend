const express = require('express');
const router = express.Router();
const userController = require('../controller/user/userController');

router.get('/', userController.homePage);
router.get('/isAuthenticated', userController.isAuthenticated)
router.get('/getUser',userController.getUser)
router.get('/logout',userController.logout)

router.post('/login', userController.login);
router.post('/signup', userController.signUp);
router.post('/editUser',userController.editUser)


router.get('/auth', (req, res) => {
    console.log("call come")
    req.session.userlogged = true
    res.status(200).json({isLogged:req.session.userlogged})
})




module.exports = router;

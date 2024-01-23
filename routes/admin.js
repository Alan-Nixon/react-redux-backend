const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin/adminController')

/* GET users listing. */
router.get('/', adminController.adminDashboard);
router.get('/adminAuthenticate', adminController.adminAuthenticated)
router.get('/getUsers', adminController.getUsers)
router.get('/blockuser', adminController.blockuser)
router.get('/searchuser',adminController.searchuser)

module.exports = router;

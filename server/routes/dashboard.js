const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const verifyToken  = require('../middleware/authMiddleware')

//Dashboard Routes
router.get('/dashboard', verifyToken, dashboardController.dashboard);
router.get('/dashboard/item/:id', verifyToken, dashboardController.dashboardViewNote);
router.put('/dashboard/item/:id', verifyToken, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/item-delete/:id', verifyToken, dashboardController.dashboardDeleteNote);
router.get('/dashboard/add', verifyToken, dashboardController.dashboardAddNote);
router.post('/dashboard/add', verifyToken, dashboardController.dashboardAddNoteSubmit);
router.get('/dashboard/search', verifyToken, dashboardController.dashboardSearch);
router.post('/dashboard/search', verifyToken, dashboardController.dashboardSearchSubmit);
//user
router.get('/login',dashboardController.userLogin)
router.post('/register',dashboardController.userRegisterSumit)
router.post('/login',dashboardController.userLoginSubmit)
router.get('/logout', dashboardController.userLogout);

module.exports = router
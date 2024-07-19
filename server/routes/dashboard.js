const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')

//Dashboard Routes
router.get('/dashboard', dashboardController.dashboard)
router.get('/dashboard/item/:id', dashboardController.dashboardViewNote)
router.put('/dashboard/item/:id', dashboardController.dashboardUpdateNote)

module.exports = router
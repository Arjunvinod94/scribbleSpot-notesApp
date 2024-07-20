const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')

//Dashboard Routes
router.get('/dashboard', dashboardController.dashboard)
router.get('/dashboard/item/:id', dashboardController.dashboardViewNote)
router.put('/dashboard/item/:id', dashboardController.dashboardUpdateNote)
router.delete('/dashboard/item-delete/:id', dashboardController.dashboardDeleteNote)
router.get('/dashboard/add', dashboardController.dashboardAddNote)
router.post('/dashboard/add', dashboardController.dashboardAddNoteSubmit)

module.exports = router
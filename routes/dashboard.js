// Rota Dashboard

const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')

require('dotenv').config()

router.get('/detailsDashboard', dashboardController.detailsDashboard)

module.exports = router
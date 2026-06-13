const express = require('express')
const router = express.Router()
const { getAlerts, createAlert} = require('../controllers/alertController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', protect, createAlert)
router.get('/', protect, getAlerts)

module.exports = router
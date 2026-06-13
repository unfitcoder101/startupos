const express = require('express')
const router = express.Router()
const { getAlerts, createAlert, triggerAlertEngine} = require('../controllers/alertController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', protect, createAlert)
router.get('/', protect, getAlerts)
router.post('/run', protect, triggerAlertEngine)

module.exports = router
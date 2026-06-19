const express = require('express')
const router = express.Router()
const { getAlerts, createAlert, triggerAlertEngine, triggerDigest} = require('../controllers/alertController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', protect, createAlert)
router.post('/digest', protect, triggerDigest)
router.get('/', protect, getAlerts)
router.post('/run', protect, triggerAlertEngine)

module.exports = router
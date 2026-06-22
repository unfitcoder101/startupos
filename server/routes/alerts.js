const express = require('express')
const router = express.Router()
const { getAlerts, createAlert, triggerAlertEngine, triggerDigest, deleteAlert} = require('../controllers/alertController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', protect, createAlert)
router.post('/digest', protect, triggerDigest)
router.get('/', protect, getAlerts)
router.post('/run', protect, triggerAlertEngine)
router.delete('/:id', protect, deleteAlert)

module.exports = router









































const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {getGithubStats, getSheetLeads} = require('../controllers/integrationController')

router.get('/github/:owner/:repo', protect, getGithubStats)
router.get('/sheets/:sheetId', protect, getSheetLeads)

module.exports =  router 
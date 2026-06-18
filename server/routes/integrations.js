const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const { getGithubStats, getSheetLeads, handleGithubWebhook } = require('../controllers/integrationController')
router.get('/github/:owner/:repo', protect, getGithubStats)
router.get('/sheets/:sheetId', protect, getSheetLeads)
router.post('/webhook/github', handleGithubWebhook)
module.exports =  router 
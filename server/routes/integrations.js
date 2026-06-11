const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {getGithubStats} = require('../controllers/integrationController')

router.get('/github/:owner/:repo', protect, getGithubStats)

module.exports =  router 
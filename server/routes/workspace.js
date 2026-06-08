const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const { getWorkspaces,createWorkspace } = require('../controllers/workspaceController')

router.post('/',  protect, createWorkspace)
router.get('/',  protect, getWorkspaces)

module.exports = router 
const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const { getWorkspaces,createWorkspace, deleteWorkspace } = require('../controllers/workspaceController')
router.delete('/:id', protect, deleteWorkspace)
router.post('/',  protect, createWorkspace)
router.get('/',  protect, getWorkspaces)

module.exports = router
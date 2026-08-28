const Alert = require('../models/Alert')
const Workspace = require('../models/Workspace')
const {runAlertEngine} = require('../services/alertEngineService')
const { sendWeeklyDigest } = require('../services/digestService')

const triggerAlertEngine = async (req, res) => {
    try{
        await runAlertEngine()
        res.json({message: 'Alert engine ran successfully'})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id).populate('workspace')
        if (!alert) return res.status(404).json({ message: 'Alert not found' })
        if (!alert.workspace) return res.status(404).json({ message: 'Workspace not found' })
        if (alert.workspace.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this alert' })
        }
        await Alert.findByIdAndDelete(req.params.id)
        res.json({ message: 'Alert deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createAlert = async (req, res) => {
   const {workspace, type, threshold, operator, slackWebhook} = req.body
   try{
    const workspaceDoc = await Workspace.findById(workspace)
    if(!workspaceDoc) return res.status(404).json({message: 'Workspace not found'})
    if(workspaceDoc.owner.toString() !== req.user.id){
        return res.status(403).json({message: 'Not your workspace'})
    }
    const alert = await Alert.create({
         workspace,
         type,
         threshold,
         operator,
         slackWebhook
        })
    res.status(201).json(alert)
   } catch(error){
    res.status(500).json({message: error.message})
   }
}

const getAlerts = async (req, res) => {
    try{
        const workspaces = await Workspace.find({owner: req.user.id}).select('_id')
        const workspaceIds = workspaces.map(w => w._id)
        const alerts = await Alert.find({workspace: {$in: workspaceIds}})
        return res.json(alerts)
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

const triggerDigest = async (req, res) => {
    try {
        await sendWeeklyDigest()
        res.json({ message: 'Digest sent successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createAlert, getAlerts, deleteAlert, triggerAlertEngine, triggerDigest}

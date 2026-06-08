const Workspace = require('../models/Workspace')



const  createWorkspace = async (req, res) => {
    const{ name, githubRepo, slackWebhook } = req.body
    try{
        const workspace = await Workspace.create({
            name,
            githubRepo,
            slackWebhook,
            owner: req.user.id
        })
        res.status(201).json(workspace)
    }catch (error){
        res.status(500).json({ message: error.message})
    }

}

const getWorkspaces= async (req, res) => {
    try{
        const workspaces = await Workspace.find({owner: req.user.id})
        return res.json(workspaces);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
module.exports = { createWorkspace, getWorkspaces }
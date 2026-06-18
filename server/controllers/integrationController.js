const { getRepoStats } = require("../services/githubService")
const {getLeads} = require("../services/sheetsService")

const getSheetLeads = async (req, res) => {
    const sheetId = req.params.sheetId
    try{
        const leads = await getLeads(sheetId)
        res.json(leads)

    } catch(error){
        res.status(500).json({message: error.message})
    }
}

const getGithubStats = async (req, res) => {

    const {owner, repo} = req.params

    try{
        const stats = await getRepoStats(owner, repo)
        res.json(stats)
    }catch(error){
        res.status(500).json({message: error.message})
    }

}
const handleGithubWebhook = async (req, res) => {
    try {
        const event = req.body
        console.log('Webhook received:', event.action || 'unknown event')
        res.status(200).json({ received: true })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {getGithubStats, getSheetLeads, handleGithubWebhook}
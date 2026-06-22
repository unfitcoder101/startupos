const axios = require('axios')
const Alert = require('../models/Alert')
const Workspace = require('../models/Workspace')
const {getRepoStats} = require('./githubService')
const {getLeads} = require('./sheetsService')

const runAlertEngine = async () => {
    console.log('Running alert engine...')

    try{
        const alerts = await Alert.find().populate('workspace')
        console.log('Found alerts:', alerts.length)

        for( const alert of alerts){
            console.log('Processing alert:', alert._id, 'workspace:', alert.workspace ? alert.workspace.name : 'NULL')
            //1. Skip if no workspace (orphaned alert)
            if(!alert.workspace) continue
            //2. Get current value
            let currentValue = 0

            if(alert.type === 'github_prs' || alert.type === 'github_issues'){
               // workspace.githubRepo looks like "facebook/react"
               if(!alert.workspace.githubRepo) continue
               const [owner, repo] = alert.workspace.githubRepo.split('/')
               const stats = await getRepoStats(owner, repo)
               currentValue = alert.type === 'github_prs' ? stats.openPRs : stats.openIssues
                console.log('Current value:', currentValue, 'Threshold:', alert.threshold)
            }
            if(alert.type === 'sheet_rows'){
                if(!alert.workspace.sheetId) continue
                const leads = await getLeads(alert.workspace.sheetId)
                currentValue = leads.length
            }
            let shouldFire = false
            if(alert.operator === 'greater_than' && currentValue > alert.threshold) shouldFire = true
            if(alert.operator === 'less_than' && currentValue < alert.threshold)  shouldFire = true
            if(alert.operator === 'equals' && currentValue === alert.threshold) shouldFire = true
            console.log('Should fire:', shouldFire)

            //4. Cooldown: don't fire if fired in last hour
            if(alert.lastFired){
                const hourAgo = new Date(Date.now() - 60*60*1000)
                if(alert.lastFired > hourAgo) shouldFire = false
            }
            //5. Fire Slack webhook
            if(shouldFire){
                console.log('Firing webhook to:', alert.slackWebhook)
                await axios.post(alert.slackWebhook, {
                    text: `🚨 StartupOS Alert: ${alert.type} is ${currentValue} (threshold: ${alert.threshold})`
                })
                alert.lastFired = new Date() 
                await alert.save()
                console.log(`Alert fired for ${alert.type}`)
            }
        }
        console.log('Alert engine complete.')
    }catch(error){
        console.error('Alert engine error:', error.message)
    }
}


module.exports = {runAlertEngine}
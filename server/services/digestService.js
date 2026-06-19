const nodemailer = require('nodemailer')
const User = require('../models/User')
const Workspace = require('../models/Workspace')
const { getRepoStats } = require('./githubService')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendWeeklyDigest = async () => {
    console.log('Sending weekly digest...')

    try {
        const users = await User.find()

        for (const user of users) {
            const workspaces = await Workspace.find({ owner: user._id })
            if (workspaces.length === 0) continue

            let summaryHtml = `<h2>Your Weekly StartupOS Digest</h2>`

            for (const ws of workspaces) {
                if (!ws.githubRepo) continue
                const [owner, repo] = ws.githubRepo.split('/')

                try {
                    const stats = await getRepoStats(owner, repo)
                    summaryHtml += `
                        <h3>${ws.name}</h3>
                        <p>Open PRs: ${stats.openPRs}</p>
                        <p>Open Issues: ${stats.openIssues}</p>
                        <p>Recent Commits: ${stats.recentCommits}</p>
                        <hr/>
                    `
                } catch (err) {
                    console.error(`Failed to fetch stats for ${ws.name}:`, err.message)
                }
            }

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your Weekly StartupOS Digest',
                html: summaryHtml
            })

            console.log(`Digest sent to ${user.email}`)
        }

        console.log('Weekly digest complete.')
    } catch (error) {
        console.error('Digest error:', error.message)
    }
}

module.exports = { sendWeeklyDigest }
const axios = require('axios')

const getRepoStats = async (owner, repo) => {
    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }

    try {
        const [pulls, issues, commits] = await Promise.all([
            axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, { headers }),
            axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, { headers }),
            axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers })
        ])

        return {
            openPRs: pulls.data.length,
            openIssues: issues.data.length,
            recentCommits: commits.data.length
        }
    } catch (error) {
        throw new Error(`GitHub fetch failed: ${error.message}`)
    }
}

module.exports = { getRepoStats }

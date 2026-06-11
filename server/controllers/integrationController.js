const { getRepoStats } = require("../services/githubService")


const getGithubStats = async (req, res) => {

    const {owner, repo} = req.params

    try{
        const stats = await getRepoStats(owner, repo)
        res.json(stats)
    }catch(error){
        res.status(500).json({message: error.message})
    }

}

module.exports = {getGithubStats}
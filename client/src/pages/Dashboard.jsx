import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MetricCard from '../components/MetricCard'
import api from '../services/api'

function Dashboard() {
    const [workspaces, setWorkspaces] = useState([])
    const [githubStats, setGithubStats] = useState(null)
    const [leads, setLeads] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {

        
    console.log('fetchData running')
    console.log('token:', localStorage.getItem('token'))
   

        try {
            // Fetch workspaces
            const wsRes = await api.get('/api/workspaces')
            setWorkspaces(wsRes.data)

            // If first workspace has a GitHub repo, fetch stats
            if (wsRes.data[0]?.githubRepo) {
                const [owner, repo] = wsRes.data[0].githubRepo.split('/')
                const ghRes = await api.get(`/api/integrations/github/${owner}/${repo}`)
                setGithubStats(ghRes.data)
            }

        } catch (err) {
            console.error('Dashboard fetch error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Operations Dashboard</h2>
                    <p className="text-gray-400 mt-1">Your startup metrics at a glance</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded mb-6">
                        Error: {error}
                    </div>
                )}

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                        title="Open Pull Requests"
                        value={githubStats?.openPRs}
                        subtitle="Across your main repo"
                        color="blue"
                    />
                    <MetricCard
                        title="Open Issues"
                        value={githubStats?.openIssues}
                        subtitle="Needs attention"
                        color="yellow"
                    />
                    <MetricCard
                        title="Recent Commits"
                        value={githubStats?.recentCommits}
                        subtitle="Last 5 commits"
                        color="green"
                    />
                </div>

                {/* Workspaces */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-white font-semibold text-lg mb-4">Your Workspaces</h3>
                    {workspaces.length === 0 ? (
                        <p className="text-gray-400">No workspaces yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {workspaces.map(ws => (
                                <div key={ws._id} className="bg-gray-700 rounded p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium">{ws.name}</p>
                                        <p className="text-gray-400 text-sm">{ws.githubRepo || 'No repo connected'}</p>
                                    </div>
                                    <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">
                                        Active
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Dashboard
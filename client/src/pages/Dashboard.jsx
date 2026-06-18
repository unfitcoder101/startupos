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
    const [newWorkspaceName, setNewWorkspaceName] = useState('')
const [newWorkspaceRepo, setNewWorkspaceRepo] = useState('')  
    const [creating, setCreating] = useState(false)
    const [alerts, setAlerts] = useState([])
    const [selectedWorkspace, setSelectedWorkspace] = useState('')
    const [alertThreshold, setAlertThreshold] = useState(5)
    const [alertType, setAlertType] = useState('github_prs')
    const [slackWebhook, setSlackWebhook] = useState('')


    useEffect(() => {
        fetchData()
    }, [])


    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName) return
        setCreating(true)
        try {
            await api.post('/api/workspaces', {
                name: newWorkspaceName,
                githubRepo: newWorkspaceRepo
            })
            setNewWorkspaceName('')
            fetchData() // refresh the list
        } catch (err) {
            console.error('Create workspace error:', err)
        } finally {
            setCreating(false)
        }
    }



    // ADD THESE TWO BELOW IT
    const handleCreateAlert = async () => {
        if (!selectedWorkspace || !slackWebhook) return
        try {
            await api.post('/api/alerts', {
                workspace: selectedWorkspace,
                type: alertType,
                threshold: Number(alertThreshold),
                slackWebhook: slackWebhook
            })
            setSlackWebhook('')
            fetchData()
        } catch (err) {
            console.error('Create alert error:', err)
        }
    }

    const handleRunEngine = async () => {
        try {
            await api.post('/api/alerts/run')
            alert('Alert engine ran! Check your Slack webhook.')
        } catch (err) {
            console.error('Run engine error:', err)
        }
    }

    const fetchData = async () => {
        console.log('fetchData running')
        console.log('token:', localStorage.getItem('token'))


        try {
            // Fetch workspaces
            const wsRes = await api.get('/api/workspaces')
            setWorkspaces(wsRes.data)

            // Fetch alerts  
        const alertsRes = await api.get('/api/alerts')
        setAlerts(alertsRes.data)

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
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-white font-semibold text-lg mb-4">Create Workspace</h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="Workspace name"
                            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="text"
                            value={newWorkspaceRepo}
                            onChange={(e) => setNewWorkspaceRepo(e.target.value)}
                            placeholder="owner/repo (e.g. facebook/react)"
                            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleCreateWorkspace}
                            disabled={creating}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
                        >
                            {creating ? 'Creating...' : 'Create'}
                        </button>
                    </div>
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


                {/* ADD EVERYTHING BELOW HERE, before the final closing divs */}

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-white font-semibold text-lg mb-4">Create Alert</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <select
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                        >
                            <option value="">Select workspace</option>
                            {workspaces.map(ws => (
                                <option key={ws._id} value={ws._id}>{ws.name}</option>
                            ))}
                        </select>

                        <select
                            value={alertType}
                            onChange={(e) => setAlertType(e.target.value)}
                            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                        >
                            <option value="github_prs">Open PRs</option>
                            <option value="github_issues">Open Issues</option>
                            <option value="sheet_rows">Sheet Rows</option>
                        </select>

                        <input
                            type="number"
                            value={alertThreshold}
                            onChange={(e) => setAlertThreshold(e.target.value)}
                            placeholder="Threshold"
                            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                        />

                        <input
                            type="text"
                            value={slackWebhook}
                            onChange={(e) => setSlackWebhook(e.target.value)}
                            placeholder="Slack webhook URL"
                            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                        />
                    </div>
                    <button
                        onClick={handleCreateAlert}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                    >
                        Create Alert
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold text-lg">Active Alerts</h3>
                        <button
                            onClick={handleRunEngine}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition"
                        >
                            Run Engine Now
                        </button>
                    </div>
                    {alerts.length === 0 ? (
                        <p className="text-gray-400">No alerts yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map(alert => (
                                <div key={alert._id} className="bg-gray-700 rounded p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium">{alert.type} {alert.operator} {alert.threshold}</p>
                                        <p className="text-gray-400 text-sm">
                                            {alert.lastFired ? `Last fired: ${new Date(alert.lastFired).toLocaleString()}` : 'Never fired'}
                                        </p>
                                    </div>
                                    <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded">
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
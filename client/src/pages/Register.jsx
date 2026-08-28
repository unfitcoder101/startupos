import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleRegister = async () => {
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/api/auth/register', { name, email, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            }))
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-white mb-2">StartupOs</h1>
                <p className="text-gray-400 mb-8">Create your account</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 py-3 px-4 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            placeholder="••••••" />
                    </div>
                    <button onClick={handleRegister} disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </div>

                <p className="text-gray-400 text-sm mt-6 text-center">
                    Already have an account? <span onClick={() => navigate('/login')}
                        className="text-blue-400 cursor-pointer hover:underline">Sign in</span>
                </p>
            </div>
        </div>
    )
}

export default Register

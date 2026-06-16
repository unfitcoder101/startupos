import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async () => {
        setError('')
        setLoading(true)

        try{
            const response = await api.post('/api/auth/login', { email, password })
console.log('response:', response.data)  // add this
localStorage.setItem('token', response.data.token)
            navigate('/dashboard')
        }catch(err){
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
        
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-white mb-2">StartupOs</h1>
                <p className="text-gray-400 mb-8">Sign in to your dashboard</p>

                {error && (
                    <div className="bg-red-500/100 border border-red-500 text-red-400 py-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm textgray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            placeholder="••••••"
                        />
                    </div>

                    <button 
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>

                <p className="text-gray-400 text-sm mt-6 text-center">
                    No account? <span
                        onClick={() => navigate('/register')}
                        className="text-blue-400 cursor-pointer hover:underline"
                >
                    Sign up
                    </span>
                </p>

            </div>

        </div>   
    )
}

export default Login
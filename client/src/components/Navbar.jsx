import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return (
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">StartupOs</h1>
        <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">{user.email}</span>
        <button 
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded transition"
        >
            Logout
        </button>
        </div>
        </nav>
    )
}
export default Navbar
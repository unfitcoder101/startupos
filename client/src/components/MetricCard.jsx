function MetricCard({ title, value, subtitle, color }) {
    const colors = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        yellow: 'border-yellow-500',
        red: 'border-red-500'
    }
    
    return (
        <div className={`bg-gray-800 rounded-lg p-6 border-l-4 ${colors[color] || colors.blue}`}>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-white text-3xl font-bold">{value ?? '—'}</p>
            {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
    )
}

export default MetricCard
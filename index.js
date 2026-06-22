const express = require('express')
require('dotenv').config()

const cron = require('node-cron')
const cors = require('cors')

const connectDB = require('./server/config/db')
const { sendWeeklyDigest } = require('./server/services/digestService')
const workspaceRoutes = require('./server/routes/workspace')
const authRoutes = require('./server/routes/auth')
const integrationRoutes = require('./server/routes/integrations')
const alertRoutes = require('./server/routes/alerts')
const { runAlertEngine } = require('./server/services/alertEngineService')

let isConnected = false

const ensureDBConnected = async (req, res, next) => {
    if (!isConnected) {
        await connectDB()
        isConnected = true
    }
    next()
}

const app = express()
app.use(ensureDBConnected)

app.use(cors({
    origin: ['http://localhost:5173', 'https://startupos-beta.vercel.app'],
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/integrations', integrationRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/alerts', alertRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'StartupOS API running' })
})

/*
// Run every hour
cron.schedule('0 * * * *', () => {
    runAlertEngine()
})

cron.schedule('0 9 * * 1', () => {
    sendWeeklyDigest()
})
*/

const PORT = process.env.PORT || 8000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
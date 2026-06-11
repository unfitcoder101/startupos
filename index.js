const express = require('express')
require('dotenv').config()

const connectDB = require('./server/config/db')
const workspaceRoutes = require('./server/routes/workspace')
const authRoutes = require('./server/routes/auth')
const integrationRoutes = require('./server/routes/integrations')

connectDB()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/integrations', integrationRoutes)
app.use('/api/workspaces', workspaceRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'StartupOS API running' })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    githubRepo: {
        type: String,
    },
    slackWebhook: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('Workspace', workspaceSchema)
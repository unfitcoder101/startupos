const  mongoose  = require("mongoose")

const alertSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workspace',
        required: true
    },
    threshold: {
        type: Number,
        required: true
    }, 
    type: {
        type: String,
        enum: ['github_prs', 'github_issues', 'sheet_rows'],
        required: true
    },
    operator: {
        type: String, 
        enum: ['greater_than', 'less_than', 'equals'],
        default: 'greater_than'
    },
    slackWebhook: {
        type: String,
        required: true
    },
    lastFired: {
        type: Date, 
        default: null
    },

}, {timestamps: true})

module.exports = mongoose.model('Alert', alertSchema)
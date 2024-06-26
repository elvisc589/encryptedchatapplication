const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }]
})

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = {
    Conversation
}
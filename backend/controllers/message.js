const { Conversation } = require("../models/conversation")
const { Message } = require("../models/message")

const sendMessage = async (req, res) => {
    try{
        const message = req.body.message
        const receiverId = req.params.id
        const senderId = req.user._id

        let conversation = await Conversation.findOne({ 
            users: { $all: [senderId, receiverId]}
        })

        if(!conversation){
            conversation = await Conversation.create({
                users: [senderId, receiverId],
                
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await newMessage.save()
        await conversation.save()

        res.status(201).json(newMessage)

    } catch(error){
        console.log("Error in sendMessage controller ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}

const getMessages = async (req, res) => {
    try{
        const chattingUserId = req.params.id
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            users: {$all: [senderId, chattingUserId]},
        }).populate("messages")

        res.status(200).json(conversation.messages)

    } catch(error){
        console.log("Error in getMessages controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

module.exports = {
    sendMessage,
    getMessages
}
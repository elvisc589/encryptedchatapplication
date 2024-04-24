const { Conversation } = require("../models/conversation")
const { User } = require("../models/user")
const { Message } = require("../models/message")
const { getReceiverSocketId, io } = require("../socket.js")
const sendMessage = async (req, res) => {
    try{
        const message = req.body.message
        const receiverUsername = req.params.username
        const senderId = req.user._id

        

        const receiver = await User.findOne({ username: receiverUsername });
        

        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        const receiverId = receiver._id

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

        const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

        res.status(201).json(newMessage)

    } catch(error){
        console.log("Error in sendMessage controller ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}

const getMessages = async (req, res) => {
    try {
        // Extract contact username and logged-in user ID
        const contactUsername = req.params.username;
        const loggedInUserId = req.user._id;

        // Find the contact user
        const contact = await User.findOne({ username: contactUsername });
        
        // Handle case where contact is not found
        if (!contact) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Find conversation between logged-in user and contact
        const conversation = await Conversation.findOne({
            users: { $all: [loggedInUserId, contact._id] },
        }).populate("messages");

        // Initialize arrays to hold categorized messages
        let messages = [];

        // Loop through messages and categorize them
        for (let i = 0; i < conversation.messages.length; i++) {
            const message = conversation.messages[i];
            if (message.senderId.equals(loggedInUserId)) {
                messages.push([message, "logged"]);
            } else {
                messages.push([message, "contact"]);
            }
        }

        // Send categorized messages in the response
        res.status(200).json(messages);
    } catch(error) {
        // Handle errors
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const loggedUsername = req.user.username;

        const conversations = await Conversation.find({ users: { $in: [userId] } }).populate('users', 'username');

        let contacts = [];
        for (let i = 0; i < conversations.length; i++) {
            const conversation = conversations[i];
            for (let j = 0; j < conversation.users.length; j++) {
                const user = conversation.users[j];
                if (user.username !== loggedUsername) {
                    contacts.push(user.username);
                }
            }
        }

        res.status(200).json(contacts);

    } catch (error) {
        console.log("Error in getConversations controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getContacts
}
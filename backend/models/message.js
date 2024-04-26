const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

// /routes/messages.js  <- File
const express = require('express');
const router = express.Router();
const { encryptMessage, decryptMessage } = require('../utils/encryption');
const { generateKeys, computeSharedSecret } = require('../utils/keyExchange');

// Route to handle sending of messages
router.post('/send', (req, res) => {
    const { message, clientPublicKey } = req.body;
    const { dh, publicKey } = generateKeys();
    const sharedSecret = computeSharedSecret(dh, clientPublicKey);
    const iv = crypto.randomBytes(12);
    const { encrypted, iv: hexIv, authTag } = encryptMessage(message, sharedSecret, iv);
});

// Route to handle receiving of messages
router.post('/receive', (req, res) => {
    const { encrypted, iv, authTag, clientPublicKey } = req.body;
    const { dh } = generateKeys();
    const sharedSecret = computeSharedSecret(dh, clientPublicKey);
    const decryptedMessage = decryptMessage(encrypted, sharedSecret, iv, authTag);
});

module.exports = router;

const Message = mongoose.model("Message", messageSchema)

module.exports = {
    Message
}
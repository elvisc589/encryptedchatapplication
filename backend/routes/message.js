const express = require("express");
const {sendMessage, getMessages, getContacts, getMessageKey} = require("../controllers/message.js")
const router = express.Router();
const { protectRoute } = require("../middleware/protectRoute.js")

router.get("/", protectRoute, getContacts)
router.get("/:username", protectRoute, getMessages)
router.post("/send/:username", protectRoute, sendMessage);
router.get("/key/:username", protectRoute, getMessageKey)

module.exports = router;
const express = require("express");
const {sendMessage} = require("../controllers/message.js")
const {getMessages} = require("../controllers/message.js")
const {getContacts} = require("../controllers/message.js")
const router = express.Router();
const { protectRoute } = require("../middleware/protectRoute.js")

router.get("/", protectRoute, getContacts)
router.get("/:username", protectRoute, getMessages)
router.post("/send/:username", protectRoute, sendMessage);

module.exports = router;
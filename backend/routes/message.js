const express = require("express");
const {sendMessage} = require("../controllers/message.js")
const {getMessages} = require("../controllers/message.js")
const router = express.Router();
const { protectRoute } = require("../middleware/protectRoute.js")


router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
const express = require("express");
const controller = require("../controllers/auth_controller.js")
const router = express.Router();


router.post("/signup", controller.signup);

router.post("/login", controller.login)

router.post("/logout", controller.logout);

module.exports = router;
const jwt = require("jsonwebtoken")

// Generate the JSON Web Token (JWT) given a userId and sign it with the JWT secret
// Store the JWT as a cookie

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15 days"
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // = 15 days, units are milliseconds
        httpOnly: true, // Prevent cross-site javascript attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
    } 

module.exports = {
    generateTokenAndSetCookie
}
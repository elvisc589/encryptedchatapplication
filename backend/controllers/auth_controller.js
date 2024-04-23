const bcrypt = require("bcryptjs")
const { User } = require("../models/user");
const { generateTokenAndSetCookie } = require("../utilities/generateToken.js")

const signup = async (req, res) => {
    try{
        console.log("Request body:", req.body); // Log the request body
        const fullName = req.body.fullName;
        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password != confirmPassword){
            return res.status(400).json({error: "Passwords do not match"})
        }

        const user = await User.findOne({ username: username })

        if (user){
            return res.status(400).json({error: "Username already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
        })

        if (newUser){
        
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
        })
    }


    } catch (error){
        console.log("Error in auth controller", error.message)

        res.status(500).json({error: "Internal Server Error"})
    }
    
}
const login = async (req, res) => {
    try {
        const username = req.body.username
        const user = await User.findOne({username});
        const password = req.body.password
        var isPasswordCorrect = false

        if (user){
            isPasswordCorrect = await bcrypt.compare(password, user.password)
        }

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ error: "Internal Server Error"})
    }
    
}
const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

module.exports = {
    signup,
    login,
    logout
}
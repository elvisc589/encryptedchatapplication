const { User } = require("../models/user");

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

        //HASH PASSWORD HERE

        const newUser = new User({
            fullName,
            username,
            password,
        })

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
        })



    } catch (error){
        console.log("Error in auth controller", error.message)

        res.status(500).json({error: "Internal Server Error"})
    }
    
}
const login = (req, res) => {
    console.log("loginUser");
}
const logout = (req, res) => {
    console.log("logoutUser");
}

module.exports = {
    signup,
    login,
    logout
}
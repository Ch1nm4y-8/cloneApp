const bcrypt = require('bcrypt');
const {User} = require('../models/User');

const express = require('express');
const { authTokenCheck } = require('../middleware/auth');
const authRouter = express.Router();


authRouter.post("/signup",async (req,res)=>{
    const {firstName, lastName, emailId, password,age,gender} = req.body

    const passHash = await bcrypt.hash(password, 10);

    const userObj = new User({
        firstName,
        lastName,
        emailId,
        password:passHash,
        age,
        gender
    });

    try{
        await userObj.save();
        var token = await userObj.getToken();
        res.cookie("authToken",token,{
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true
        });
        res.json({"message":"User created Successfully...",
            "data":userObj});
    }
    catch(err){
        res.status(400).send("Error creating user,\n"+err);
    }
})


authRouter.post("/login",async (req,res)=>{
    const {emailId, password} = req.body

    try{
        const user = await User.findOne({emailId:emailId});
        const isValidPassword = await user.validatePassword(password);
        if (isValidPassword){
            var token = await user.getToken();
            res.cookie("authToken",token,{
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true
            });
            res.send(user);
        }
        else{
            return res.status(400).send("Invalid Credentials");
        }

    }
    catch(err){
        res.status(400).send("Invalid Credentials : "+err)
    }
})


authRouter.post("/logout",authTokenCheck, (req,res)=>{
    res.clearCookie('authToken');
    res.send("You've been Successfully Logged Out...");
})

module.exports = {authRouter}


const express  = require('express');
const bcrypt = require('bcrypt');

const {authTokenCheck} = require('../middleware/auth');
const {User} = require('../models/User');

const {validateEditProfileData} = require('../utils/validation');

const profileRouter = express.Router()



profileRouter.get("/profile/view",authTokenCheck,(req,res)=>{
    res.send(req.user);
})

profileRouter.patch("/profile/edit",authTokenCheck, async (req,res)=>{

    const isEditAllowed = validateEditProfileData(req);

    try{
        if(isEditAllowed){
            const user = req.user;
            
            const updatedUser = await User.findByIdAndUpdate(user._id, req.body , {runValidators: true});
            res.json({"message":"Updated User Details Successfully...","data":updatedUser});
        }
        else{
            res.send("Invalid Edit Request")
        }
    }
    catch(err){
        res.status(400).send("Something went wrong , : "+err);
    }
})


profileRouter.post("/profile/password",authTokenCheck, async (req,res)=>{
    const {currentPassword, newPassword}=req.body;
    const user = req.user;
    
    const isValidPassword = await user.validatePassword(currentPassword);
    console.log(isValidPassword);

    try{
        if(isValidPassword){
            const passHash = await bcrypt.hash(newPassword, 10);
            user.password = passHash;
            await user.save();
            res.send("Password updated successfully");
        }
        else{
            throw new Error("Invalid Current Password");
        }
    }
    catch(err){
        res.send("ERROR : "+err);
    }


})

module.exports = {profileRouter}
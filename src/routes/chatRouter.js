const express = require('express');
const { authTokenCheck } = require('../middleware/auth');
const {Chat} = require('../models/Chat');
const {isValidUser,isValidConnection} = require('../utils/validation');
const chatRouter = express.Router();

chatRouter.post("/getChats",authTokenCheck,async (req,res)=>{
    const userId = req.user._id;
    const {targetUserId} = req.body;

    try{
        //check if target User Id is valid
        if (!isValidUser(targetUserId)){
            return res.status(400).json({"message":"Invalid User"});
        }
        //check if userId and targetUserId has a connection or not.
        if (!isValidConnection(userId,targetUserId)){
            return res.status(400).json({"message":"Invalid User"});
        }

        // check if chat already exists between them.
        let chat = await Chat.findOne({
            participants: {$all: [userId,targetUserId]},
        }).populate({
            path:'messages.senderId messages.text',
            select: 'firstName photoUrl'
        });
        console.log(userId,targetUserId)

        if(!chat){
            chat = new Chat({participants:[userId,targetUserId],messages:[]});
            await chat.save();
        }
        //send the chats
        res.send(chat.messages);
        

    }catch(err){
        res.send("Error : "+err)
    }
})

module.exports = {chatRouter}
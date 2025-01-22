const express = require('express');
const { authTokenCheck } = require('../middleware/auth');
const { User } = require('../models/User');
const { Connection } = require('../models/Connection');
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId",authTokenCheck, async (req,res)=>{
    const {status, userId} = req.params;
    const fromUserId = req.user._id;
    const toUserId = userId;
    try{
        
        allowedStatus = ["interested", "ignored"]
        if (!allowedStatus.includes(status)){
            return res.status(400).send("Invalid Status , can be either interested or ignored");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser || toUserId == fromUserId){
            return res.status(400).send("Invalid userId");
        }
        
        const isConnectionAlreadyPresent = await Connection.findOne({
            $or: [
                { 
                    fromUser:toUserId, toUser:fromUserId
                },
                {
                    fromUser:fromUserId , toUser:toUserId
                }
            ]
        });
        if (isConnectionAlreadyPresent){
            return res.status(400).json({"message":"Connection Request Already Present."})
        }

        const connectionObj = new Connection({
            fromUser:fromUserId,
            toUser:toUserId,
            status
        });
        const data = await connectionObj.save();

        res.json({
            "message" : "Request to " + toUser.firstName + ":" + status,
            data
        })

    }catch(err){
        res.status(400).send("ERROR : "+err);
    }
})



requestRouter.post("/request/review/:status/:requestId",authTokenCheck,async (req,res)=>{
    const {status,requestId} = req.params;
    const loggedInUser = req.user

    try{
        allowedStatus = ["accepted" , "rejected"]
        if (!allowedStatus.includes(status)){
            return res.status(400).json({"Error":"Invalid status type"});
        }

        const connectionRequest = await Connection.findOne({_id:requestId, toUser:loggedInUser._id, status:"interested"})
        if (!connectionRequest){
            return res.status(400).json({"Error":"Connection does not exist"})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({"Message":"Request "+status+" Successfully..", data})
    }
    catch(err){
        res.status(400).send("Error : "+err);
    }
})


module.exports = {requestRouter};
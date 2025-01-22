const express = require('express');
const { authTokenCheck } = require('../middleware/auth');
const { Connection } = require('../models/Connection');
const {User} = require('../models/User');
const userRouter = express.Router();

const SAFE_ALLOWED_DETAILS = 'firstName lastName photoUrl skills age gender'

userRouter.get("/user/requests/received",authTokenCheck,async (req,res)=>{
    const loggedInUser = req.user;

    try{
        const requests = await Connection.find({toUser:loggedInUser._id, status:"interested"}).populate('fromUser', SAFE_ALLOWED_DETAILS);
        if(!requests.length){
            return res.json({"Message":"No connections yet","data":[]});
        }
        res.json({"data":requests});
    }catch(err){
        res.status(400).send("ERROR : "+err);
    }
})


userRouter.get("/user/connections", authTokenCheck, async(req,res)=>{
    const loggedInUser = req.user;

    try{
        const connections = await Connection.find({
            $or:[
                {fromUser:loggedInUser._id, status:"accepted"},
                {toUser:loggedInUser._id, status:"accepted"}
            ]
        }).populate('fromUser',SAFE_ALLOWED_DETAILS)
        .populate('toUser',SAFE_ALLOWED_DETAILS);

        const data = connections.map((row)=>{
            if(row.fromUser._id.toString() === loggedInUser._id.toString()){
                return row.toUser;
            }
            return row.fromUser;
        })
        res.send(data);
    }catch(err){
        res.status(400).send("Error : "+err);
    }
})

userRouter.get("/user/feed",authTokenCheck,async(req,res)=>{
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit>30 ? 30:limit;
    const skip = ((page-1)*limit);

    try{
        const data = await Connection.find({$or:
            [
                {fromUser: loggedInUser._id},
                {toUser: loggedInUser._id}
            ]
        }).select('fromUser toUser');

        const toBeHiddenUsersFromFeedSet = new Set();
        data.forEach((req) => {
            toBeHiddenUsersFromFeedSet.add(req.fromUser.toString()),
            toBeHiddenUsersFromFeedSet.add(req.toUser.toString())
        })

        const toBeHiddenUsersFromFeedArray = Array.from(toBeHiddenUsersFromFeedSet);
        const users = await User.find({$and:
            [
                {_id: {$nin: toBeHiddenUsersFromFeedArray}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(SAFE_ALLOWED_DETAILS)
        .skip(skip)
        .limit(limit);

        res.send(users);

    }catch(err){
        res.status(400).send("Error : "+err)
    }
})

module.exports = {userRouter};
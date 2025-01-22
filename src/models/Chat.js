const mongoose = require('mongoose');
const {Schema} = mongoose;
const {User} = require('../models/User')

const MessageSchema = new Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true
    }

},{timestamps:true})

const ChatSchema = new Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }],
    messages:[
        {
            type:MessageSchema,
        }
    ]
})

const Chat = mongoose.model('Chat',ChatSchema)
module.exports = {Chat}

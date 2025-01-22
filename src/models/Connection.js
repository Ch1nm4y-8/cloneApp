const mongoose = require('mongoose');
const {Schema} = mongoose;

const connectionSchema = new Schema({
    fromUser:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    toUser:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values : ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is incorrect status type.'
        }
    }
},{
    timestamps:true,
})

const Connection = mongoose.model("Connection",connectionSchema);
module.exports = {Connection};
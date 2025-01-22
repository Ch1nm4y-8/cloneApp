const socket = require("socket.io");
const { Chat } = require("../models/Chat");

const initializeSocket = (server) =>{
    const io = socket(server, {
        cors:{
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) =>{

        socket.on("joinChat", ({userName,userId,targetUserId})=>{
            const roomId = [userId,targetUserId].sort().join('_');
            socket.join(roomId);
        });


        socket.on("sendMessage",async ({userName,userId,targetUserId,message})=>{
            const roomId = [userId,targetUserId].sort().join('_');
            
            console.log(userName +" sent : "+message);
            //check if chat exists
            let chatObj = await Chat.findOne({
                participants: {$all: [userId,targetUserId]},
            })
            
            
            if(!chatObj){
                chatObj = new Chat({participants:[userId,targetUserId],messages:[]});
                await chatObj.save();
            }
            
            
            chatObj.messages.push({
                senderId:userId,
                text:message
            })
            await chatObj.save();
            

            if(message){
                io.to(roomId).emit("receiveMessage",{});
            }
        });

        socket.on("disconnect", ()=>{});
    })
}

module.exports = {initializeSocket}
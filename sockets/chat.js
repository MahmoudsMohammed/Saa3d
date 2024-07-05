const Chat = require("../models/chat");
const Message = require("../models/message");

module.exports = (io) =>{
    io.on('connection', socket => {
        socket.on('joinChatRoom', chatId =>{
            socket.join(chatId);
        })
    
        socket.on('newMsg', async (chatId, msg) =>{
            let chat = await Chat.findById(chatId);
            const newMsg = new Message(msg);
            chat.messages.push(newMsg);
            await newMsg.save();
            await chat.save(() =>{
                io.to(chatId).emit('addMsg', msg);
            });
        })
        
    })
}
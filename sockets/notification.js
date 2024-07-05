// const User = require("../models/user");

module.exports = (io) =>{
    io.on('connection', socket => {
        socket.on('joinNotfsRoom', id =>{
            socket.join(id);
        })
    
        socket.on('newNotf', userId =>{
            io.to(userId).emit('addNotf');
        })
        
    })
}
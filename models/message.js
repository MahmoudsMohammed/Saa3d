const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: String,
    sender:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    time: Date
});

module.exports = mongoose.model('Message', messageSchema);
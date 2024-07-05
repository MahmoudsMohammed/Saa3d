const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: Date,
    body: String,
    link: String
});

module.exports = mongoose.model('Notification', notificationSchema);
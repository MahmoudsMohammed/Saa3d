const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('../models/service');
require('../models/notification');
require('../models/chat');
const ImageSchema = require('./image').schema;

// using passport bcs it's easy to encrypt users passwords and login them in ...
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    city: String,
    gender: String,
    point: Number,
    services: [
        {
            type: Schema.Types.ObjectId,
            ref: "Service"
        }
    ],
    joinedAt: Date,
    image: ImageSchema,
    unreadNotf: {
        type: Number,
        default: 0
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: "Notification"
        }
    ],
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: "Chat"
        }
    ]
});

// adding username & password & make sure that username is unique & more functions
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    customer:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    freelancer:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    review: String,
    rate: Number,
    isFinished: Number
});

module.exports = mongoose.model('Service', serviceSchema);
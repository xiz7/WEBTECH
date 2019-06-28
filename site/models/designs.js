const mongoose = require('mongoose');

const designSchema = mongoose.model("design", new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 16,
        required: true
    },
    stars: {
        type: Number,
        default: 0,
        min: 0
    },
    dateAdded: {
        type: Date,
    },
    imageurl: {
        type: String,
        required: true
    }
}));

module.exports = designSchema;
const mongoose = require('mongoose');
const Joi = require('Joi');

const userSchema = mongoose.model("user", new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minlength: 6,
        maxlength: 16,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
}));

function validateUser(user) {
    const schema = {
        username: Joi.string().min(6).max(16).required(),
        password: Joi.string().required()
    }
    return Joi.validate(user, schema);
}

module.exports.userSchema = userSchema;
module.exports.validate = validateUser;
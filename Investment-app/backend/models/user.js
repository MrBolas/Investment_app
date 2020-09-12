const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../helper/logger');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    investments: [{type: mongoose.Schema.Types.ObjectId, required: false, ref: 'House'}]
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ email: user.email, userId: user._id.toString()} , "secret_this_should_be_longer", {expiresIn: "1h"});

    user.token = token;

    await user.save();
    return token;
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

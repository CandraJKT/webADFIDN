const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    license: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);

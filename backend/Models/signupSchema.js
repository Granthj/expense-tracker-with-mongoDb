const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isPremium: {
        type: Boolean,
        default: false,
        required: true
    },

    totalExpense: {
        type: Number,
        default: 0,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
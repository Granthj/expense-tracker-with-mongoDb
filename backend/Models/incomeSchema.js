const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    month: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
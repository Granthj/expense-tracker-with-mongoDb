const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const ForgotPasswordRequest = mongoose.model(
    'ForgotPassword',
    forgotPasswordSchema
);

module.exports = ForgotPasswordRequest;
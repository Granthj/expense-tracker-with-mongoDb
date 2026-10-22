const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },

    paymentSessionId: {
        type: String,
        required: true
    },

    orderAmount: {
        type: Number,
        required: true
    },

    orderCurrency: {
        type: String,
        required: true,
        default: 'INR'
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failure'],
        required: true,
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
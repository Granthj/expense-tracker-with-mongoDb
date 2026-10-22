const {
    createOrder,
    getPaymentStatus
} = require('../Services/cashFreeServices');

const Payment = require('../Models/paymentSchema');
const User = require('../Models/signupSchema');


const processPayment = async (req, res) => {

    const orderId = "ORDER-" + Date.now();

    const orderAmount = 2000;

    const orderCurrency = "INR";

    const customerID = "1";

    const customerPhone = "9999999999";

    try {

        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone
        );

        await Payment.create({
            orderId: orderId,
            paymentSessionId: paymentSessionId,
            orderAmount: orderAmount,
            orderCurrency: orderCurrency,
            paymentStatus: "Pending"
        });

        console.log(req.userId, 'hello');

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isPremium = true;

        await user.save();

        res.json({
            paymentSessionId,
            orderId
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Something went wrong"
        });

    }
};


const paymentStatus = async (req, res) => {

    try {

        const { orderId } = req.params;

        const orderStatus = await getPaymentStatus(orderId);

        const updatePayment = await Payment.findOneAndUpdate(
            {
                orderId: orderId
            },
            {
                paymentStatus: orderStatus
            },
            {
                new: true
            }
        );

        if (!updatePayment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.json({
            orderId,
            orderStatus
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Something went wrong not getting payment status"
        });

    }
};


module.exports = {
    processPayment,
    paymentStatus
};
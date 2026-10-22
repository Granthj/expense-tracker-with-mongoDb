// import { Cashfree, CFEnvironment } from "cashfree-pg";
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");
exports.createOrder = async (

    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerID,
    customerPhone
) => {

    try {
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hrs from now
        const formattedExpiryDate = expiryDate.toISOString();

        var request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                customer_id: customerID,
                customer_phone: customerPhone
            },
            "order_meta": {
                // "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}",
                // "notify_url": "https://www.cashfree.com/devstudio/preview/pg/webhooks/75093621",
                return_url: "http://localhost:3000/api/payment-status/"+orderId,
                payment_methods: "cc,dc,upi"
            },
            order_expiry_time: formattedExpiryDate
        };

        const response = await cashfree.PGCreateOrder(request);
        return response.data.payment_session_id;
            // console.log('Order created successfully:', response.data);
    }
    catch(error) {
            console.error('Error:', error.message);
    };
} 
exports.getPaymentStatus = async(orderId)=>{
    try{
        const response = await Cashfree.PGOrderFetchPayments("2026-04-07",orderId);
        let getOrderResponse = response.data;
        let orderStatus;

        if(getOrderResponse.filter((transaction) => transaction.payment_status === 'SUCCESS').length > 0){
            orderStatus = 'Success';
        }
        else if(getOrderResponse.filter((transaction) => transaction.payment_status === 'PENDING').length > 0){
            orderStatus = 'Pending';
        }
        else{
            orderStatus = "Failure";
        }
        return orderStatus;
    }
    catch(err){
        console.error('Error:', err.message);
    }
}   
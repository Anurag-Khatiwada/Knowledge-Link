const paypal = require('paypal-rest-sdk');
require('dotenv').config();

console.log("PayPal Client ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PayPal Secret ID:", process.env.PAYPAL_SECRET_ID);

paypal.configure({
    mode : "sandbox",
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET_ID
})

module.exports = paypal
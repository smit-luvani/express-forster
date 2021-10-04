/**
 * @author Smit Luvani
 * @description Export Razorpay Controller
 */

// Orders API
module.exports.createOrderController = require('./create-order')
module.exports.getOrderByIDController = require('./get-order')
module.exports.updateOrderByIDController = require('./update-order')

// Signature Verifier
module.exports.validateSignatureController = require('./validate-signature')

// Payment API
module.exports.capturePaymentController = require('./capture-payment')
module.exports.getPayment = require('./get-payment')
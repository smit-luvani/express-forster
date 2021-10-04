/**
 * @author Smit Luvani
 * @description It will create order for payment gateway
 * @response Razorpay Response
 * @param {razorpay_payment_id:String,razorpay_order_id:String,signature:String} Razorpay Response after Payment
 */

const { winston: logger } = require('../../services')
const crypto = require('crypto')
const { razorpay } = require('../../config/secrets.json')

module.exports = ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {

    logger.info('Controller > Razorpay > Validate Signature')

    try {

        // Validate Params
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            throw new Error('Missing required params')
        }

        // Create hmac signature and match with razorpay signature
        return crypto.createHmac('sha256', razorpay[process.env.NODE_ENV].key_secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex') == razorpay_signature

    } catch (error) {
        return { error: JSON.parse(error.message) };
    }

}
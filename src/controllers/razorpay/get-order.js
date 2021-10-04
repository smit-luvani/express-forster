/**
 * @author Smit Luvani
 * @description Get Order using Order ID
 * @param {string} razorpay_order_id
 */

const { winston: logger } = require('../../services')
const { api } = require('../../services').razorpay
const unirest = require('unirest')

module.exports = async(razorpay_order_id) => {

    logger.info('Controller > Razorpay > Get Order')

    try {

        // Validate Params
        if (!razorpay_order_id) {
            throw new Error('Order ID is required')
        }

        // Create hmac signature and match with razorpay signature
        return unirest
            .get(`${api.baseURL}/orders/` + razorpay_order_id)
            .headers({ Authorization: api.header.Authorization, 'Content-Type': 'application/json' })
            .then(result => result.body)

    } catch (error) {
        return { error: JSON.parse(error.message) };
    }

}
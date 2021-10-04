/**
 * @author Smit Luvani
 * @description Get Payments based on Order ID
 * @param {string} razorpay_id
 */

const { winston: logger } = require('../../services')
const { api } = require('../../services').razorpay
const unirest = require('unirest')

module.exports = async(razorpay_id, { by = 'AUTO_DETECT' } = {}) => {

    logger.info('Controller > Razorpay > Get Payment by Payment ID / Order ID')

    try {

        // Validate Params
        if (!razorpay_id) {
            throw new Error('Order ID required')
        }

        let is_payment;

        if (by == 'AUTO_DETECT') {
            // Split "razorpay_id" with _
            const split_by = String(razorpay_id).split('_')
            is_payment = split_by[0] === 'pay'
        } else if (by == 'payment') {
            is_payment = true
        } else if (by == 'order') {
            is_payment = false
        }

        if (is_payment) {
            return unirest
                .get(`${api.baseURL}/payments/` + razorpay_id)
                .headers({ Authorization: api.header.Authorization, 'Content-Type': 'application/json' })
                .then(result => result.body)
        }

        return unirest
            .get(`${api.baseURL}/orders/` + razorpay_id + '/payments')
            .headers({ Authorization: api.header.Authorization, 'Content-Type': 'application/json' })
            .then(result => result.body)


    } catch (error) {
        return { error: JSON.parse(error.message) };
    }

}
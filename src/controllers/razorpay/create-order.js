/**
 * @author Smit Luvani
 * @description It will create order for payment gateway
 * @response Razorpay Response
 * @param {amount: Integer, notes: [], custom_receipt: String}
 */

const { api } = require('../../services').razorpay
const { winston: logger } = require('../../services')
const { randomDigit } = require('../../utils/random')
const unirest = require('unirest')

module.exports = ({ amount, notes, custom_receipt }) => {

    logger.info('Controller > Razorpay > Create Order')

    let receipt = custom_receipt || randomDigit()

    try {
        // Validate amount
        if (!amount) {
            throw new Error('Amount is required')
        }

        let netAmount = ~~(amount * 100)

        if (isNaN(netAmount)) {
            throw new Error('Amount is not valid')
        }

        if (netAmount < 100) {
            throw new Error('Minimum Amount is 1')
        }

        // Validate notes
        if (!notes) {
            throw new Error('Notes is required')
        }

        if (typeof notes !== 'object') {
            throw new Error('Notes should be an json object')
        }

        notes.payment_via = 'FG-GROUP'

        // Create order
        let payload = {
            amount: netAmount,
            notes,
            receipt,
            currency: 'INR',
            payment_capture: 1
        }

        return unirest
            .post(`${api.baseURL}/orders`)
            .headers({ Authorization: api.header.Authorization, 'Content-Type': 'application/json' })
            .send(payload)
            .then(result => result.body)

    } catch (error) {
        return { error: JSON.parse(error.message) };
    }

}
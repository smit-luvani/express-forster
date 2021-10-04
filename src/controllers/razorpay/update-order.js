/**
 * @author Smit Luvani
 * @description It will update order notes
 * @response Razorpay Response
 * @param {string} id
 * @param {Object} notes
 */

const { api } = require('../../services').razorpay
const { winston: logger } = require('../../services')
const unirest = require('unirest')

module.exports = ({ id, notes }) => {
    logger.info('Controller > Razorpay > Update Order')

    try {
        // Validate amount
        if (!id) {
            throw new Error('ID is required')
        }

        // Validate notes
        if (!notes) {
            throw new Error('Notes is required')
        }

        if (typeof notes !== 'object') {
            throw new Error('Notes should be an json object')
        }

        notes.payment_domain = 'FG-GROUP'

        return unirest
            .patch(`${api.baseURL}/orders/` + id)
            .headers({ Authorization: api.header.Authorization, 'Content-Type': 'application/json' })
            .send({ notes })
            .then(result => result.body)

    } catch (error) {
        return { error: JSON.parse(error.message) };
    }
}
"use strict";
/**
 * @author Smit Luvani
 * @description Configure Razorpay with Key
 * @module https://www.npmjs.com/package/razorpay
 */

const logger = require('../winston')
const razorpay = require('razorpay')
const { razorpay: razorpay_secrets } = require('../../config/secrets.json')
const { logging } = require('../../config/default.json')

try {
    module.exports = new razorpay({
        key_id: razorpay_secrets[process.env.NODE_ENV].key_id,
        key_secret: razorpay_secrets[process.env.NODE_ENV].key_secret
    })
    logging.razorpay ? logger.info('Service [Razorpay]: Connected') : null;
} catch (error) {
    logger.error('Service [Razorpay]: Failed to Initialize Object.\n' + error)
}
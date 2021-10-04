/**
 * @author Smit Luvani
 * @description Export Razorpay API + SDK
 * @module https://www.npmjs.com/package/razorpay
 * @documentation https://docs.razorpay.com/docs/checkout
 */

const logger = require('../winston'),
    razorpay = require('razorpay'),
    { razorpay: razorpay_secrets } = require('../../config/secrets.json'),
    { logging } = require('../../config/default.json');

let header = {
    // Base64 encoded
    "Authorization": 'Basic ' + Buffer.from(`${razorpay_secrets[process.env.NODE_ENV].key_id}:${razorpay_secrets[process.env.NODE_ENV].key_secret}`).toString('base64')
}

module.exports.api = {
    baseURL: 'https://api.razorpay.com/v1',
    header,
    key_id: razorpay_secrets[process.env.NODE_ENV].key_id
}

try {
    module.exports.sdk = new razorpay({
        key_id: razorpay_secrets[process.env.NODE_ENV].key_id,
        key_secret: razorpay_secrets[process.env.NODE_ENV].key_secret,
    });
    logging.razorpay ? logger.info('Service [Razorpay]: Connected') : null;
} catch (error) {
    logger.error('Service [Razorpay]: Failed to Initialize Object.\n' + error);
}
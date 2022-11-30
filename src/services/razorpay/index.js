/**
 * @author Smit Luvani
 * @description Export Razorpay API + SDK
 * @module https://www.npmjs.com/package/razorpay
 * @documentation https://docs.razorpay.com/docs/checkout
 */

const logger = require('../winston'),
    razorpay = require('razorpay'),
    { logging } = require('../../config/default.js');

let header = {
    // Base64 encoded
    "Authorization": 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
}

module.exports.api = {
    baseURL: 'https://api.razorpay.com/v1',
    header,
    key_id: process.env.RAZORPAY_KEY_ID
}

try {
    module.exports.sdk = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    logging.razorpay ? logger.info('Service [Razorpay]: Connected') : null;
} catch (error) {
    logger.error('Service [Razorpay]: Failed to Initialize Object.\n' + error);
}
const logger = require('../winston'),
    razorpay = require('razorpay');
const { paymentGateway } = require('../../common');
const getENV = require('../../helpers/get-env');

/**
 * @author Smit Luvani
 * @description Initializes a Razorpay instance with the given credentials and logs the status.
 * @param {string} key_id - The key ID for the Razorpay instance.
 * @param {string} key_secret - The key secret for the Razorpay instance.
 * @param {string} name - The name identifier for logging purposes.
 * @returns {import('razorpay') & { key_id: string }} - The initialized Razorpay instance with the key_id property.
 */
const initializeRazorpay = (key_id, key_secret, name) => {
    try {
        const instance = new razorpay({
            key_id,
            key_secret,
        });
        // Attach key_id as a property for easy access
        instance.key_id = key_id;
        logger.info(`Service [Razorpay][${name}]: Successful`);
        return instance;
    } catch (error) {
        logger.error(`Service [Razorpay][${name}]: Failed to Initialize Object.`, error);
        return null;
    }
};

let RazorpayDefault = initializeRazorpay(getENV('RAZORPAY_KEY'), getENV('RAZORPAY_SECRET'), paymentGateway.razorpay);

/**
 * @author Smit Luvani
 * @description Retrieves the appropriate Razorpay instance based on the specified gateway.
 * @param {('RAZORPAY')} gateway - The gateway identifier.
 * @returns {import('razorpay') & { key_id: string }} - The corresponding Razorpay instance.
 * @throws {Error} Throws an error if the gateway is invalid.
 */
module.exports = (gateway) => {
    if (Object.values(paymentGateway).includes(gateway) == false) {
        logger.error('Service [Razorpay]: Invalid Gateway');
        throw new Error('Invalid Gateway');
    }

    switch (gateway) {
        case paymentGateway.razorpay:
            return RazorpayDefault;
        default:
            logger.error('Service [Razorpay]: Invalid Gateway');
            throw new Error('Invalid Gateway');
    }
};
